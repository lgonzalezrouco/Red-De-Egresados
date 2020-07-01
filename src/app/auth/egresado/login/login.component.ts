import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
    password: new FormControl('', [Validators.required,
      Validators.minLength(8)]),
  });

  // Variables para controlar los patrones del formulario
  emailPattern = this.loginForm.get('email');
  passwordPattern = this.loginForm.get('password');

  // Variable para mostrar si hubo algun error en el formulario
  message: string;

  // Variable para saber si la contraseña es visible o no
  public hide = true;

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onLogin() {
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.authSvc.login(email, password);

      if (typeof user !== 'string') {
        if (user && user.user.emailVerified) {
          console.log(user);
          this.router.navigate(['/home']);
        } else if (user) {
          console.log(user);
          this.router.navigate(['/wait-verification']);
        } else {
          this.router.navigate(['/register']);
        }
      } else {
        this.message = user;
        console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
