import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class MiscService {
  constructor(
    private angularFirestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router
  ) {}

  // CONSEGUIR UN USUARIO ESPECIFICO

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

  // GUARDA UN USUARIO ESPECIFICO EN LOCAL STORAGE

  public async saveUser(id) {
    let user = await this.getUser(id);
    console.log(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  // CONSIGUE LAS REDES SOCIALES DE UN USUARIO

  // Se usa para traer a un usuario especifico
  public async getUserSocial(id: string) {
    //Trae de la collection 'users', el documento con el id que se pasa como argumento
    let user = await this.angularFirestore
      .collection('social')
      .doc(id)
      .get()
      .toPromise();
    return user.data();
  }

  public async saveUserSocial(id) {
    let user = await this.getUserSocial(id);
    localStorage.setItem('social', JSON.stringify(user));
  }

  // Se usa para traer un titulo
  public existeElEgresado(tituloEgreso) {
    tituloEgreso = tituloEgreso.toString();
    return this.angularFirestore
      .collection('titulos')
      .doc(tituloEgreso)
      .snapshotChanges();
  }

  /*
  ┌─────────────────────────────────────────────────┐
  │                   LOGGED USER                   │
  └─────────────────────────────────────────────────┘
  */

  // Se usa para almacenar en el localStorage la informacion del usuario de firebase
  async getUserFirebase(): Promise<void> {
    this.afAuth.user.subscribe((user) => {
      localStorage.setItem('userFirebase', JSON.stringify(user));
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

  async getSocialOfLoggedUser(uid?: string): Promise<void> {
    if(uid){
      const dataUser = await this.getUserSocial(uid);
      localStorage.setItem('social', JSON.stringify(dataUser));
    } else {
      this.afAuth.user.subscribe(async (user) => {
        const dataUser = await this.getUserSocial(user.uid);
        localStorage.setItem('social', JSON.stringify(dataUser));
      });
    }
  }

  async getAdmin(email): Promise<boolean> {
    const dataAdmin = await this.angularFirestore.collection('admins').doc(email).get().toPromise();
    return dataAdmin.exists
  }

  async checkIfUserIsLogged(): Promise<string> {
    await this.getUserFirebase();
    await this.getUserAndUID();
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    console.log(user);
    console.log(uid);
    console.log(userFirebase);

    if (user && uid) {
      if (!userFirebase.emailVerified) {
        return 'wait-verification';
      } else {
        if (user.empresa && uid) {
          return 'empresa';
        } else if (!user.empresa && uid) {
          return 'egresado';
        }
      }
    } else {
      return 'nadie';
    }
  }

  async notAllowed(tipoDeUsuario: string): Promise<void> {
    if (tipoDeUsuario == 'wait-verification') {
      this.router.navigate(['/wait-verification']);
    } else if (tipoDeUsuario == 'empresa') {
      this.router.navigate(['/home-empresa']);
    } else if (tipoDeUsuario == 'egresado') {
      this.router.navigate(['/home-egresado']);
    } else if (tipoDeUsuario == 'admin') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/home']);
      localStorage.removeItem('user');
      localStorage.removeItem('userFirebase');
      localStorage.removeItem('uid');
      localStorage.removeItem('social');
    }
  }
}
