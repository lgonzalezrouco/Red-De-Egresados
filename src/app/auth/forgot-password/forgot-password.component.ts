import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, EmailValidator, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  providers: [AuthService]
})
export class ForgotPasswordComponent implements OnInit {

  passwordForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),

  });

  // Variables para controlar los patrones del formulario
  emailPattern = this.passwordForm.get('email');

  constructor(private authSvc: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    const uid = localStorage.getItem('uid');
    if(uid != null) {
      this.router.navigate(['/home']);
    }
    /* this.authSvc.afAuth.user.subscribe((u) => {
      if (!u) {
        this.router.navigate(['/home']);
      }
    }); */
  }

  onReset() {
    try{

      // Se agarra el valor de userEmail
      const { email } = this.passwordForm.value;

      // Verifica si esta vacio o no
      if (email !== ''){

        //Llama al metodo resetear contraseña
        this.authSvc.resetPassword(email);

        // Se hace un aviso que el mail fue enviado
        window.alert('Email sent, check your inbox!');

        // Se redirige al login
        this.router.navigate(['/login']);

      } else {

        // Se hace un aviso que pide un email
        window.alert('Please, enter an email');
      }
    } catch (error) {

      // Si hubo algun error hace un aviso
      window.alert('There was an error, please try again');
      console.log(error);
    }
  }
}
