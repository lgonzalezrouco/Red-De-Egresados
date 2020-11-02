import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { User } from '../interfaces/user';
import { Empresa } from '../interfaces/empresa';
import { MiscService } from './misc.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Titulos } from '../interfaces/titulos';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(
    private angularFirestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private miscSvc: MiscService
  ) {}

  /*
  ┌────────────────────────────────────────────┐
  │                  EGRESADO                  │
  └────────────────────────────────────────────┘
  */

  // INICIAL

  // Se usa para escribir los datos del usuario en Firestore
  setUserDataLogUp(user, values, photoURL?) {
    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const userRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `users/${user.uid}`
    );

    const capacitacionesRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `capacitaciones/${user.uid}`
    );

    const socialRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `social/${user.uid}`
    );

    if (typeof photoURL === 'undefined') {
      photoURL = '';
    }

    values.firstName =
      values.firstName.charAt(0).toUpperCase() + values.firstName.slice(1);
    values.lastName =
      values.lastName.charAt(0).toUpperCase() + values.lastName.slice(1);

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
      cellphone: values.cellphone,
      empresa: false,
      descripcion: '',
    };

    const capacitacionData = {
      capacitaciones: [],
    };

    const socialData = {};

    /*
     * Se guarda la informacion que esta dentro de userData en el
     * Firestore usando la referencia creada antes
     */
    socialRef.set(socialData, {
      merge: true,
    });
    capacitacionesRef.set(capacitacionData, {
      merge: true,
    });
    return userRef.set(userData, {
      merge: true,
    });
  }

  // EDICION

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

      data.firstName =
        data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1);
      data.lastName =
        data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1);

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
          cellphone: data.cellphone,
          empresa: false,
          descripcion: data.descripcion,
        });

      await this.miscSvc.saveUser(user.uid);
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

  /*
  ┌───────────────────────────────────────────┐
  │                  EMPRESA                  │
  └───────────────────────────────────────────┘
  */

  // INICIAL

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
      firstName: values.firstName,
      CUIT: CUIT,
      verificada: verificada,
      photoURL: photoURL,
      empresa: true,
      descripcion: '',
      lema: '',
    };

    /*
     * Se guarda la informacion que esta dentro de userData en el
     * Firestore usando la referencia creada antes
     */
    return userRef.set(empresaData, {
      merge: true,
    });
  }

  // EDICION

  // Se usa para editar la empresa
  async editEmpresa(user: any, data: any, url: any) {
    try {
      if (data.firstName == '') {
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
          CUIT: user.CUIT,
          verificada: user.verificada,
          photoURL: url,
          empresa: true,
          descripcion: data.descripcion,
          lema: data.lema,
        });

      await this.miscSvc.saveUser(user.uid);

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  /*
  ┌──────────────────────────────────────────┐
  │                 BUSQUEDA                 │
  └──────────────────────────────────────────┘
  */

  // CON OPCIONES

  searchWithOption(profesion?, minAge?, maxAge?, orientacion?) {
    try {
      let today = new Date();
      let todayYear: number = today.getFullYear();
      let todayMonth: number = today.getMonth();
      let todayDay: number = today.getDate();
      let minAgeDate;
      let maxAgeDate;
      let noHayProfesion: boolean = false;
      let noHayOrientacion: boolean = false;
      let noHayMaxAge: boolean = false;
      let noHayMinAge: boolean = false;

      if (!profesion) {
        noHayProfesion = true;
      }
      if (!minAge) {
        noHayMinAge = true;
      }
      if (!maxAge) {
        noHayMaxAge = true;
      }
      if (!orientacion) {
        noHayOrientacion = true;
      }

      if (!noHayMinAge) {
        minAge = parseInt(minAge);
        minAgeDate = new Date(todayYear - minAge, todayMonth, todayDay);
      }

      if (!noHayMaxAge) {
        maxAge = parseInt(maxAge);
        maxAgeDate = new Date(todayYear - maxAge, todayMonth, todayDay);
      }

      if (
        noHayOrientacion === true &&
        noHayProfesion === true &&
        noHayMaxAge === true &&
        noHayMinAge === true
      ) {
        return new Error('No se selecciono ningun parametro');
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === true &&
        noHayMaxAge === true &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) => ref.where('birthday', '<=', minAgeDate))
          .valueChanges();
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === true &&
        noHayMaxAge === false &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) => ref.where('birthday', '>=', maxAgeDate))
          .valueChanges();
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === true &&
        noHayMaxAge === false &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('birthday', '<=', minAgeDate)
              .where('birthday', '>=', maxAgeDate)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === false &&
        noHayMaxAge === true &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) => ref.where('profesion', '==', profesion))
          .valueChanges();
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === false &&
        noHayMaxAge === true &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('profesion', '==', profesion)
              .where('birthday', '<=', minAgeDate)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === false &&
        noHayMaxAge === false &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('profesion', '==', profesion)
              .where('birthday', '>=', maxAgeDate)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === true &&
        noHayProfesion === false &&
        noHayMaxAge === false &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('profesion', '==', profesion)
              .where('birthday', '<=', minAgeDate)
              .where('birthday', '>=', maxAgeDate)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === true &&
        noHayMaxAge === true &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref.where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === true &&
        noHayMaxAge === true &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('birthday', '<=', minAgeDate)
              .where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === true &&
        noHayMaxAge === false &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('birthday', '>=', maxAgeDate)
              .where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === true &&
        noHayMaxAge === false &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('birthday', '<=', minAgeDate)
              .where('birthday', '>=', maxAgeDate)
              .where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === false &&
        noHayMaxAge === true &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('profesion', '==', profesion)
              .where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === false &&
        noHayMaxAge === true &&
        noHayMinAge === false
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('profesion', '==', profesion)
              .where('birthday', '<=', minAgeDate)
              .where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === false &&
        noHayMaxAge === false &&
        noHayMinAge === true
      ) {
        return this.angularFirestore
          .collection('users', (ref) =>
            ref
              .where('profesion', '==', profesion)
              .where('birthday', '>=', maxAgeDate)
              .where('orientacion', '==', orientacion)
          )
          .valueChanges();
      } else if (
        noHayOrientacion === false &&
        noHayProfesion === false &&
        noHayMaxAge === false &&
        noHayMinAge === false
      ) {
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
    } catch (error) {
      return error.message;
    }
  }

  // POR NOMBRE

  searchwithFirstName(start, end) {
    console.log(start);
    console.log(end);
    return this.angularFirestore
      .collection('users', (ref) =>
        ref.limit(25).orderBy('firstName').startAt(start).endAt(end)
      )
      .valueChanges();
  }

  /*
  ┌──────────────────────────────────────────────┐
  │                 CAPACITACION                 │
  └──────────────────────────────────────────────┘
  */

  // CONSEGUIR CAPACITACIONES

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

  public async getFewCapacitaciones(id: string) {
    //Trae de la collection 'capacitaciones', el documento con el id que se pasa como argumento
    let capacitaciones = await this.angularFirestore
      .collection('capacitaciones', (ref) => ref.limit(2))
      .doc(id)
      .get()
      .toPromise();
    return capacitaciones.data();
  }

  // AGREGAR EXEPRIENCIA

  // Se usa para almacenar las capacitaciones en Firestore
  async setCapacitacionesDeUser(values) {
    const uid = localStorage.getItem('uid');
    let arregloCapacitaciones: Array<Object> = [];
    let capacitacionesExistentes;
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

    capacitacionesRef.update({
      capacitaciones: arregloCapacitaciones,
    });

    return arregloCapacitaciones;
  }

  // ELIMINAR EXPERIENCIA

  //Se usa para eliminar una capacitacion especifica
  async deleteCapacitacion(indice) {
    const uid = localStorage.getItem('uid');
    let arregloCapacitaciones: Array<Object> = [];
    let capacitacionesExistentes;
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

    capacitacionesRef.update({
      capacitaciones: arregloCapacitaciones,
    });

    return arregloCapacitaciones;
  }

  /*
  ┌─────────────────────────────────────────┐
  │                 TITULOS                 │
  └─────────────────────────────────────────┘
  */

  // AGREGAR TITULOS CON CSV

  uploadTitulos(titulos): Promise<void> {
    try {
      return titulos.forEach((titulo) => {
        let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
          `titulos/${titulo.DNI}`
        );

        const tituloData = {
          nombre: titulo.nombre,
          apellido: titulo.apellido,
          yearDeEgreso: titulo.yearDeEgreso,
        };

        titulosRef.set(tituloData, {
          merge: true,
        });
      });
    } catch (error) {
      console.log(error)
      return error.message;
    }
  }

  // CONSEGUIR TODOS LOS TITULOS

  async getTitulos(): Promise<Titulos[]> {
    let query = this.angularFirestore
      .collection('titulos', (ref) => ref.orderBy('apellido'))
      .get()
      .toPromise();
    let titulos: Titulos[] = [];
    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let titulo: Titulos = {
          DNI: doc.id,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          yearDeEgreso: doc.data().yearDeEgreso,
        };
        titulos.push(titulo);
      });
    });
    return titulos;
  }

  // ELIMINAR UN TITULO

  async eliminarTitulo(DNI) {
    let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `titulos/${DNI}`
    );

    return await titulosRef.delete();
  }

  // EDITAR UN TITULO

  editarTitulo(DNI, nombre, apellido, yearDeEgreso) {
    let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `titulos/${DNI}`
    );

    const tituloData = {
      nombre: nombre,
      apellido: apellido,
      yearDeEgreso: yearDeEgreso,
    };

    titulosRef.set(tituloData, {
      merge: true,
    });
  }

  // AGREGAR UN TITULO

  async agregarTitulo(DNI, nombre, apellido, yearDeEgreso): Promise<string> {
    try {
      DNI = DNI.toString();

      let query = await this.angularFirestore
        .collection('titulos')
        .doc(DNI)
        .get()
        .toPromise();

      if (query.exists) {
        throw new Error('Ya existe un titulo con ese DNI');
      } else {
        let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
          `titulos/${DNI}`
        );

        const tituloData = {
          nombre: nombre,
          apellido: apellido,
          yearDeEgreso: yearDeEgreso,
        };

        titulosRef.set(tituloData, {
          merge: true,
        });

        return 'OK';
      }
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  /*
  ┌────────────────────────────────────────┐
  │                 ADMINS                 │
  └────────────────────────────────────────┘
  */

  // CONSEGUIR TODOS LOS ADMINS

  async getAdmins() {
    let query = this.angularFirestore.collection('admin').get().toPromise();
    let admins = [];
    await query.then((docs) => {
      docs.forEach((doc) => {
        let admin = {
          id: doc.id,
          email: doc.data().email,
        };
        admins.push(admin);
      });
    });
    return admins;
  }

  // AGREGAR UN ADMIN

  async agregarAdmin(email): Promise<void> {
    let id: string = this.angularFirestore.createId();

    // Se hace una referencia al documento del usuario teniendo en cuenta su uid
    const adminRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `admin/${id}`
    );

    /*
     * Se guarda en la variable adminData el mail que permite logearse como admin
     */
    const adminData = {
      email: email,
    };

    /*
     * Se guarda la informacion que esta dentro de adminData en el
     * Firestore usando la referencia creada antes
     */
    return adminRef.set(adminData, {
      merge: true,
    });
  }

  // ELIMINAR UN ADMIN

  async eliminarAdmin(id) {
    let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `admin/${id}`
    );

    return await titulosRef.delete();
  }

  /*
  ┌─────────────────────────────────────────┐
  │                 GETTERS                 │
  └─────────────────────────────────────────┘
  */

  async getAllEgresados() {
    let query = this.angularFirestore
      .collection('users', (ref) => ref.where('empresa', '==', false))
      .get()
      .toPromise();
    let egresados: User[] = [];
    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let egresado: User = {
          uid: doc.id,
          email: doc.data().email,
          firstName: doc.data().firstName,
          lastName: doc.data().lastName,
          birthday: doc.data().birthday,
          photoURL: doc.data().photoURL,
          gender: doc.data().gender,
          cellphone: doc.data().cellphone,
          yearDeEgreso: doc.data().yearDeEgreso,
          orientacion: doc.data().orientacion,
          profesion: doc.data().profesion,
          DNI: doc.data().DNI,
          empresa: doc.data().empresa,
          descripcion: doc.data().descripcion,
        };
        egresados.push(egresado);
      });
    });
    return egresados;
  }

  async getAllEmpresas() {
    let query = this.angularFirestore
      .collection('users', (ref) => ref.where('empresa', '==', true))
      .get()
      .toPromise();
    let empresas: Empresa[] = [];
    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let empresa: Empresa = {
          uid: doc.id,
          email: doc.data().email,
          firstName: doc.data().firstName,
          photoURL: doc.data().photoURL,
          CUIT: doc.data().CUIT,
          verificada: doc.data().verificada,
          empresa: doc.data().empresa,
          descripcion: doc.data().descripcion,
          lema: doc.data().lema,
        };
        empresas.push(empresa);
      });
    });
    return empresas;
  }
}
