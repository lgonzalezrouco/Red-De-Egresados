import { Injectable, NgZone, ErrorHandler } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { User } from 'src/app/shared/interfaces/user';
import { Empresa } from 'src/app/shared/interfaces/empresa';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser } from 'src/app/shared/interfaces/githubUser';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public afAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    public angularFirestorage: AngularFireStorage,
    public router: Router,
    public ngZone: NgZone,
    private http: HttpClient
  ) {}

  /*
  ┌─────────────────────────────────────────────┐
  │                    LOGIN                    │
  └─────────────────────────────────────────────┘
  */

  //Login con email y password
  async login(email: string, password: string) {
    try {
      //Hace un signIn con email y password
      const result = await this.afAuth.signInWithEmailAndPassword(
        email,
        password
      );
      localStorage.setItem('uid', result.user.uid);
      localStorage.setItem('userFirebase', JSON.stringify(result.user));
      await this.saveUser(result.user.uid);
      /* let user = await this.getUser(result.user.uid);
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user)); */
      /*this.getUser(result.user.uid).subscribe((userSnapshot) => {
        localStorage.setItem(
          'user',
          JSON.stringify(userSnapshot.payload.data())
        );
      });*/

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  /*
  ┌─────────────────────────────────────────────┐
  │                   SIGN UP                   │
  └─────────────────────────────────────────────┘
  */

  async register(email: string, password: string, values) {
    try {
      console.log('Llegue a register');
      // Crea un usuario usando email y password y lo mete en el firebase
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Manda un mail para verificar su email
      this.sendVerificationEmail();

      /*
       * Se llama al metodo SetUserDataLogUp para meter los datos
       * del usuario en firestore
       */
      this.setUserDataLogUp(result.user, values);

      localStorage.setItem('uid', result.user.uid);

      localStorage.setItem('userFirebase', JSON.stringify(result.user));

      await this.saveUser(result.user.uid);

      /* this.getUser(result.user.uid).subscribe((userSnapshot) => {
        localStorage.setItem(
          'user',
          JSON.stringify(userSnapshot.payload.data())
        );
      }); */

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  async registerEmpresa(email: string, password: string, values) {
    try {
      console.log('Llegue a register');
      // Crea un usuario usando email y password y lo mete en el firebase
      const result = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      console.log(result);

      // Manda un mail para verificar su email
      this.sendVerificationEmail();

      /*
       * Se llama al metodo SetUserDataLogUp para meter los datos
       * del usuario en firestore
       */
      this.setEmpresaDataLogUp(result.user, values);

      localStorage.setItem('uid', result.user.uid);
      localStorage.setItem('userFirebase', JSON.stringify(result.user));
      await this.saveUser(result.user.uid);
      /* this.getUser(result.user.uid).subscribe((userSnapshot) => {
        localStorage.setItem(
          'user',
          JSON.stringify(userSnapshot.payload.data())
        );
      }); */

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  /*
  ┌──────────────────────────────────────────────┐
  │            SECURITY VERIFICATIONS            │
  └──────────────────────────────────────────────┘
  */

  //Se usa para que el usuario resetee su password
  async resetPassword(email: string): Promise<void> {
    try {
      // Se envia un mail al usuario para resetear la contraseña
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  // Se envia un mail al usuario para que verifique su email
  async sendVerificationEmail(): Promise<void> {
    return (await this.afAuth.currentUser).sendEmailVerification();
  }

  // Se usa para almacenar en el localStorage la informacion del usuario de firebase
  async getUserFirebase(): Promise<void> {
    this.afAuth.user.subscribe((user) => {
      localStorage.setItem('userFirebase', JSON.stringify(user));
      console.log(user);
    });
  }

  // Se usa para almacenar en el localStorage la informacion del usuario de firestore y el uid
  async getUserAndUID(): Promise<void> {
    this.afAuth.user.subscribe(async (user) => {
      localStorage.setItem('uid', user.uid);
      const dataUser = await this.getUser(user.uid);
      localStorage.setItem('user', JSON.stringify(dataUser));
    });
  }

  /*
  ┌─────────────────────────────────────────────┐
  │                   LOG OUT                   │
  └─────────────────────────────────────────────┘
  */

  // Se usa para deslogear al usuario
  async logout() {
    try {
      await this.afAuth.signOut();

      // Elimina al user del local storage
      localStorage.removeItem('user');
      localStorage.removeItem('userFirebase');
      localStorage.removeItem('uid');
    } catch (error) {
      console.log(error);
    }
  }

  /*
  ┌─────────────────────────────────────────────┐
  │                  FIRESTORE                  │
  └─────────────────────────────────────────────┘
  */

  // Se usa para almacenar las capacitaciones en Firestore
  async setCapacitacionesDeUser(values) {
    const uid = localStorage.getItem('uid');
    let arregloCapacitaciones: Array<Object> = [];
    let capacitacionesExistentes;
    /* let refCapacitaciones = this.getCapacitaciones(uid); */
    await this.getCapacitaciones(uid).then((capacitaciones) => {
      capacitacionesExistentes = capacitaciones.capacitaciones;
      for (const capacitacion of capacitacionesExistentes) {
        console.log(capacitacion);
        arregloCapacitaciones.push(capacitacion);
      }
    });
    console.log(1);
    console.log(arregloCapacitaciones);
    console.log(2);
    console.log(values);
    arregloCapacitaciones.push(values);
    console.log(3);
    console.log(arregloCapacitaciones);

    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const capacitacionesRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `capacitaciones/${uid}`
    );

    /*
     * Se guarda la informacion que esta dentro de capacitaciones en el
     * Firestore usando la referencia creada antes
     */
    return capacitacionesRef.update({
      capacitaciones: arregloCapacitaciones,
    });
  }

  //Se usa para eliminar una capacitacion especifica
  async deleteCapacitacion(indice) {
    const uid = localStorage.getItem('uid');
    let arregloCapacitaciones: Array<Object> = [];
    let capacitacionesExistentes;
    /* let refCapacitaciones = this.getCapacitaciones(uid); */
    await this.getCapacitaciones(uid).then((capacitaciones) => {
      capacitacionesExistentes = capacitaciones.capacitaciones;
      for (const capacitacion of capacitacionesExistentes) {
        console.log(capacitacion);
        arregloCapacitaciones.push(capacitacion);
      }
    });

    if (indice !== -1) {
      arregloCapacitaciones.splice(indice, 1);
    }

    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const capacitacionesRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `capacitaciones/${uid}`
    );

    return capacitacionesRef.update({
      capacitaciones: arregloCapacitaciones,
    });
  }

  // Se usa para traer a un usuario especifico
  public async getCapacitaciones(id: string): Promise<any> {
    //Trae de la collection 'capacitaciones', el documento con el id que se pasa como argumento
    let capacitaciones = await this.angularFirestore
      .collection('capacitaciones')
      .doc(id)
      .get()
      .toPromise();
    return capacitaciones.data();
  }

  // Se usa para escribir los datos del usuario en Firestore
  setUserDataLogUp(user, values, photoURL?) {
    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.uid}`
    );

    const capacitacionesRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `capacitaciones/${user.uid}`
    );

    if (typeof photoURL === 'undefined') {
      photoURL = '';
    }

    /*
     * Se guarda en la variable userData toda la informacion del usuario
     * usando la interfaz User
     */
    const userData: User = {
      uid: user.uid,
      email: user.email,
      firstName: values.firstName,
      lastName: values.lastName,
      gender: values.gender,
      photoURL: photoURL,
      birthday: values.birthday,
      yearDeEgreso: values.yearDeEgreso,
      orientacion: values.orientacion,
      profesion: values.profesion,
      DNI: values.DNI,
      tituloEgreso: values.tituloEgreso,
      cellphone: values.cellphone,
      empresa: false,
      githubUsername: '',
    };

    const capacitacionData = {
      capacitaciones: [],
    };
    /*
     * Se guarda la informacion que esta dentro de userData en el
     * Firestore usando la referencia creada antes
     */
    capacitacionesRef.set(capacitacionData, {
      merge: true,
    });
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Se usa para escribir los datos del usuario en Firestore
  setEmpresaDataLogUp(user, values, photoURL?) {
    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.uid}`
    );

    if (typeof photoURL === 'undefined') {
      photoURL = '';
    }

    let verificada = values.verificada;

    if (typeof verificada === 'undefined') {
      verificada = '';
    }

    let CUIT = values.CUIT.toString();
    console.log(CUIT);

    /*
     * Se guarda en la variable userData toda la informacion del usuario
     * usando la interfaz User
     */
    const empresaData: Empresa = {
      uid: user.uid,
      email: user.email,
      empresaName: values.empresaName,
      CUIT: CUIT,
      verificada: verificada,
      photoURL: photoURL,
      empresa: true,
    };

    /*
     * Se guarda la informacion que esta dentro de userData en el
     * Firestore usando la referencia creada antes
     */
    return userRef.set(empresaData, {
      merge: true,
    });
  }

  // Se usa para editar un usuario que ya se encuentre en Firestore
  async editUser(user: any, data: any, url: any) {
    try {
      if (
        data.firstName == '' ||
        data.lastName == '' ||
        data.gender == '' ||
        data.birthday == '' ||
        data.cellphone == ''
      ) {
        return 'Por favor llene todos los campos obligatorios';
      }

      // Se actualizan todos los datos del documento del usuario
      const result = this.angularFirestore
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          email: user.email,
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          photoURL: url,
          birthday: data.birthday,
          yearDeEgreso: user.yearDeEgreso,
          orientacion: user.orientacion,
          profesion: data.profesion,
          DNI: user.DNI,
          tituloEgreso: user.tituloEgreso,
          cellphone: data.cellphone,
          empresa: false,
          githubUsername: user.githubUsername
        });

      await this.saveUser(user.uid);
      /* this.getUser(user.uid).subscribe((userSnapshot) => {
        localStorage.setItem(
          'user',
          JSON.stringify(userSnapshot.payload.data())
        );
      }); */

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // Se usa para editar la empresa
  async editEmpresa(user: any, data: any, url: any) {
    try {
      if (data.empresaName == '') {
        return 'Por favor llene todos los campos obligatorios';
      }

      // Se actualizan todos los datos del documento del usuario
      const result = this.angularFirestore
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          email: user.email,
          empresaName: data.empresaName,
          CUIT: user.CUIT,
          verificada: user.verificada,
          photoURL: url,
          empresa: true,
        });

      await this.saveUser(user.uid);

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // Se usa para traer a un usuario especifico
  public async getUser(id: string) {
    //Trae de la collection 'users', el documento con el id que se pasa como argumento
    let user = await this.angularFirestore
      .collection('users')
      .doc(id)
      .get()
      .toPromise();
    return user.data();
  }

  public async saveUser(id) {
    let user = await this.getUser(id);
    console.log(user);
    localStorage.setItem('user', JSON.stringify(user));
  }
  /*
  public getUser(id: string) {
    //Trae de la collection 'users', el documento con el id que se pasa como argumento
    return this.angularFirestore.collection('users').doc(id).snapshotChanges();
  } */

  // Se usa para traer un titulo
  public existeElEgresado(tituloEgreso) {
    tituloEgreso = tituloEgreso.toString();
    return this.angularFirestore
      .collection('titulos')
      .doc(tituloEgreso)
      .snapshotChanges();
  }

  searchWithOption(profesion, minAge, maxAge, orientacion) {
    let today = new Date();
    let todayYear: number = today.getFullYear();
    let todayMonth: number = today.getMonth();
    let todayDay: number = today.getDate();

    minAge = parseInt(minAge);
    maxAge = parseInt(maxAge);

    let minAgeDate = new Date(todayYear - minAge, todayMonth, todayDay);
    let maxAgeDate = new Date(todayYear - maxAge, todayMonth, todayDay);

    return this.angularFirestore
      .collection('users', (ref) =>
        ref
          .where('profesion', '==', profesion)
          .where('birthday', '<=', minAgeDate)
          .where('birthday', '>=', maxAgeDate)
          .where('orientacion', '==', orientacion)
      )
      .valueChanges();
  }

  searchwithFirstName(start, end) {
    console.log(start);
    console.log(end);
    return this.angularFirestore
      .collection('users', (ref) =>
        ref.limit(25).orderBy('firstName').startAt(start).endAt(end)
      )
      .valueChanges();
  }

  // Se usa para traer de la DB los usuarios que coincidan con el filtro y el parametro de busqueda
  search(start, end, filter) {
    console.log(filter);
    console.log(start);
    console.log(end);
    return this.angularFirestore
      .collection('users', (ref) =>
        ref.limit(5).orderBy(filter).startAt(start).endAt(end)
      )
      .valueChanges();
  }

  /*
  ┌─────────────────────────────────────────────┐
  │                   STORAGE                   │
  └─────────────────────────────────────────────┘
  */

  // Se usa para subir un archivo a Storage
  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.angularFirestorage.upload(nombreArchivo, datos);
  }

  // Se usa para obtener una referencia de un archivo en Storage
  public referenciaCloudStorage(nombreArchivo: string) {
    return this.angularFirestorage.ref(nombreArchivo);
  }

  /*
  ┌─────────────────────────────────────────┐
  │                   API                   │
  └─────────────────────────────────────────┘
  */

  public async agregarGithub(githubUsername, user) {
    try {
      if (!this.checkGithubUser(githubUsername)) {
        console.log("entre")
        return 'El usuario no existe';
      }

      // Se actualizan todos los datos del documento del usuario
      const result = this.angularFirestore
        .collection('users')
        .doc(user.uid)
        .set({
          uid: user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          photoURL: user.photoURL,
          birthday: user.birthday,
          yearDeEgreso: user.yearDeEgreso,
          orientacion: user.orientacion,
          profesion: user.profesion,
          DNI: user.DNI,
          tituloEgreso: user.tituloEgreso,
          cellphone: user.cellphone,
          empresa: false,
          githubUsername: githubUsername,
        });

      await this.saveUser(user.uid);
      /* this.getUser(user.uid).subscribe((userSnapshot) => {
          localStorage.setItem(
            'user',
            JSON.stringify(userSnapshot.payload.data())
          );
        }); */

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  public getGithubUser(name: string): Promise<GithubUser> {
    const url = `https://api.github.com/users/${name}`;
    return this.http.get<GithubUser>(url).toPromise();
  }

  public async checkGithubUser(githubUsername: string): Promise<boolean> {
    let mensajeDeError: string;
    await this.getGithubUser(githubUsername).then((result) => {
      mensajeDeError = result.message;
    });
    if (mensajeDeError == 'Not Found') {
      return false;
    } else {
      return true;
    }
  }
}
