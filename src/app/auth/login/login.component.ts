import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  // Variables para controlar los patrones del formulario
  emailPattern = this.loginForm.get('email');
  passwordPattern = this.loginForm.get('password');

  // Variable para mostrar si hubo algun error en el formulario
  errorMessage: string;

  // Variable para saber si la contraseña es visible o no
  public hide = true;

  public seApretoElBoton: boolean = false;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private miscSvc: MiscService
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    console.log(hayUnUsuario);
    if (hayUnUsuario != 'nadie') {
      await this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  async onLogin() {
    this.seApretoElBoton = true;
    const { email, password } = this.loginForm.value;
    try {
      const user = await this.authSvc.login(email, password);

      if (typeof user !== 'string') {
        if (user && user.user.emailVerified == true) {
          console.log(user);
          this.router.navigate(['/home']);
        } else if (user && user.user.emailVerified == false) {
          console.log(user);
          this.router.navigate(['/wait-verification']);
        } else {
          this.router.navigate(['/register']);
        }
      } else {
        this.errorMessage = "El email y/o la contraseña son incorrectos";
        console.log(user);
        this.seApretoElBoton = false;
      }
    } catch (error) {
      this.errorMessage = "El email y/o la contraseña son incorrectos";
      this.seApretoElBoton = false
    }
  }
}
