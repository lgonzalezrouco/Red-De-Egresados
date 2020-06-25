import { Injectable, NgZone, ErrorHandler } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { stringify } from 'querystring';
import { User } from 'src/app/shared/interfaces/user';
import { Empresa } from 'src/app/shared/interfaces/empresa';

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
    public ngZone: NgZone
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
    } catch (error) {
      console.log(error);
    }
  }

  /*
  ┌─────────────────────────────────────────────┐
  │                  FIRESTORE                  │
  └─────────────────────────────────────────────┘
  */

  // Se usa para escribir los datos del usuario en Firestore
  setUserDataLogUp(user, values, photoURL?) {
    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.uid}`
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
      areasDeConocimiento: values.areasDeConocimiento,
      DNI: values.DNI,
      tituloEgreso: values.tituloEgreso,
      cellphone: values.cellphone,
      empresa: false,
    };

    /*
     * Se guarda la informacion que esta dentro de userData en el
     * Firestore usando la referencia creada antes
     */
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
  editUser(user: any, data: any, url: any) {
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
          areasDeConocimiento: data.areasDeConocimiento,
          DNI: user.DNI,
          tituloEgreso: user.tituloEgreso,
          cellphone: data.cellphone,
          empresa: false,
        });

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  editEmpresa(user: any, data: any, url: any) {
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
          empresa: true
        });

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // Se usa para traer a un usuario especifico
  public getUser(id: string) {
    //Trae de la collection 'users', el documento con el id que se pasa como argumento
    return this.angularFirestore.collection('users').doc(id).snapshotChanges();
  }

  public existeElEgresado(tituloEgreso) {
    return this.angularFirestore.collection('titulos').doc(tituloEgreso).snapshotChanges();
  }

  searchPrueba(search: string, searchFilter: string) {
    return this.angularFirestore
      .collection('users', (ref) => ref.where(searchFilter, '==', search))
      .valueChanges();
  }

  // Se usa para traer de la DB los usuarios que coincidan con el filtro y el parametro de busqueda
  search(start, end, filter) {
    console.log(filter);
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
}
