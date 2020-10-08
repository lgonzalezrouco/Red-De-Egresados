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

  // EDICION

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
          `titulos/${titulo.id}`
        );

        const tituloData = {
          DNI: titulo.DNI,
          nombre: titulo.nombre,
          apellido: titulo.apellido,
          nroDeAlumno: titulo.nroDeAlumno,
          yearDeEgreso: titulo.yearDeEgreso,
        };

        titulosRef.set(tituloData, {
          merge: true,
        });
      });
    } catch (error) {
      return error.message;
    }
  }

  // CONSEGUIR TODOS LOS TITULOS

  async getTitulos(): Promise<Titulos[]> {
    let query = this.angularFirestore
      .collection('titulos', (ref) =>
        ref.orderBy('apellido')
      )
      .get()
      .toPromise();
    let titulos: Titulos[] = [];
    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let titulo: Titulos = {
          titulo: doc.id,
          DNI: doc.data().DNI,
          nroDeAlumno: doc.data().nroDeAlumno,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          yearDeEgreso: doc.data().yearDeEgreso,
        };
        titulos.push(titulo);
      });
    });
    return titulos;
  }

  // CONSEGUIR DE A 10 TITULOS

  async getTitulosInicial() {
    let query = this.angularFirestore
      .collection('titulos', (ref) => ref.limit(10).orderBy('apellido'))
      .get()
      .toPromise();
    let titulos = [];
    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let titulo = {
          id: doc.id,
          DNI: doc.data().DNI,
          nroDeAlumno: doc.data().nroDeAlumno,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          yearDeEgreso: doc.data().yearDeEgreso,
        };
        titulos.push(titulo);
      });
    });
    return titulos;
  }

  async getFewTitulos(limit, startApellido) {
    let query = this.angularFirestore
      .collection('titulos', (ref) =>
        ref.limit(limit).orderBy('apellido').startAfter(startApellido)
      )
      .get()
      .toPromise();
    let titulos = [];
    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let titulo = {
          id: doc.id,
          DNI: doc.data().DNI,
          nroDeAlumno: doc.data().nroDeAlumno,
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

  async eliminarTitulo(id) {
    let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `titulos/${id}`
    );

    return await titulosRef.delete();
  }

  // EDITAR UN TITULO

  editarTitulo(id, DNI, nombre, apellido, nroDeAlumno, yearDeEgreso) {
    let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
      `titulos/${id}`
    );

    let DNIString: string = DNI;

    const tituloData = {
      DNI: DNIString,
      nombre: nombre,
      apellido: apellido,
      nroDeAlumno: nroDeAlumno,
      yearDeEgreso: yearDeEgreso,
    };

    titulosRef.set(tituloData, {
      merge: true,
    });
  }

  // AGREGAR UN TITULO

  async agregarTitulo(
    id,
    DNI,
    nombre,
    apellido,
    nroDeAlumno,
    yearDeEgreso
  ): Promise<string> {
    try {
      let query: Promise<any>;
      let titulos = [];
      query = this.angularFirestore
        .collection('titulos', (ref) => ref.where('DNI', '==', DNI))
        .get()
        .toPromise();

      await query.then((documentos) => {
        documentos.forEach((doc) => {
          let titulo = {
            id: doc.id,
            DNI: doc.data().DNI,
            nroDeAlumno: doc.data().nroDeAlumno,
            nombre: doc.data().nombre,
            apellido: doc.data().apellido,
            yearDeEgreso: doc.data().yearDeEgreso,
          };
          titulos.push(titulo);
        });
      });

      if (titulos.length > 0) {
        throw new Error('Ya existe un titulo con ese DNI');
      }

      let titulosRef: AngularFirestoreDocument<any> = this.angularFirestore.doc(
        `titulos/${id}`
      );

      const tituloData = {
        DNI: DNI,
        nombre: nombre,
        apellido: apellido,
        nroDeAlumno: nroDeAlumno,
        yearDeEgreso: yearDeEgreso,
      };

      titulosRef.set(tituloData, {
        merge: true,
      });

      return 'OK';
    } catch (error) {
      return error.message;
    }
  }

  //  BUSCAR UN TITULO

  async searchTitulo(start, end, campo) {
    let query: Promise<any>;
    let titulos = [];
    query = this.angularFirestore
      .collection('titulos', (ref) =>
        ref.orderBy(campo).startAt(start).endAt(end)
      )
      .get()
      .toPromise();

    await query.then((documentos) => {
      documentos.forEach((doc) => {
        let titulo = {
          id: doc.id,
          DNI: doc.data().DNI,
          nroDeAlumno: doc.data().nroDeAlumno,
          nombre: doc.data().nombre,
          apellido: doc.data().apellido,
          yearDeEgreso: doc.data().yearDeEgreso,
        };
        titulos.push(titulo);
      });
    });

    return titulos;
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
          tituloEgreso: doc.data().tituloEgreso,
          empresa: doc.data().empresa,
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
          empresaName: doc.data().empresaName,
          photoURL: doc.data().photoURL,
          CUIT: doc.data().CUIT,
          verificada: doc.data().verificada,
          empresa: doc.data().empresa,
        };
        empresas.push(empresa);
      });
    });
    return empresas;
  }
}
