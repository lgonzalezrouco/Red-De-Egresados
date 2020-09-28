import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MiscService } from './misc.service';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: any;

  constructor(
    public afAuth: AngularFireAuth,
    private miscSvc: MiscService,
    private firestoreSvc: FirestoreService,
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
      await this.miscSvc.saveUser(result.user.uid);

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

  // REGISTER EGRESADO

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
      this.firestoreSvc.setUserDataLogUp(result.user, values);

      localStorage.setItem('uid', result.user.uid);

      localStorage.setItem('userFirebase', JSON.stringify(result.user));

      await this.miscSvc.saveUser(result.user.uid);

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  // REGISTER EMPRESA

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
      this.firestoreSvc.setEmpresaDataLogUp(result.user, values);

      localStorage.setItem('uid', result.user.uid);
      localStorage.setItem('userFirebase', JSON.stringify(result.user));
      await this.miscSvc.saveUser(result.user.uid);
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

  // RESETEAR CONTRASEÑA

  //Se usa para que el usuario resetee su password
  async resetPassword(email: string): Promise<void> {
    try {
      // Se envia un mail al usuario para resetear la contraseña
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log(error);
    }
  }

  // MANDAR MAIL DE VERIFICACION

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
      localStorage.removeItem('userFirebase');
      localStorage.removeItem('uid');
      localStorage.removeItem('social');

    } catch (error) {
      console.log(error);
    }
  }
}
