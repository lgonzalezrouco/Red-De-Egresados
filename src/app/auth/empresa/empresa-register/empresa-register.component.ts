import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-empresa-register',
  templateUrl: './empresa-register.component.html',
  styleUrls: ['./empresa-register.component.scss'],
})
export class EmpresaRegisterComponent implements OnInit {
  registerEmpresaForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z. ]*'),
      Validators.minLength(2),
    ]),
    CUIT: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
  });

  // Variables para controlar los patrones del formulario
  public emailPattern = this.registerEmpresaForm.get('email');
  public passwordPattern = this.registerEmpresaForm.get('password');
  public firstNamePattern = this.registerEmpresaForm.get('firstName');
  public cuitPattern = this.registerEmpresaForm.get('CUIT');

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: string;

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
    if (hayUnUsuario != 'nadie') {
      await this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  onRegister() {
    try {
      this.seApretoElBoton = true;
      this.createUser();
    } catch (error) {
      console.log(error);
      this.seApretoElBoton = false;
    }
  }

  async createUser() {
    // guarda los valores del email, password
    const { email, password } = this.registerEmpresaForm.value;
    try {
      console.log(this.registerEmpresaForm.value);
      // Intenta hacer el register con los datos del formulario
      const user = await this.authSvc.registerEmpresa(
        email,
        password,
        this.registerEmpresaForm.value
      );

      // Si el resultado de la operacion no es un string (osea que no devolvio un error)
      if (typeof user !== 'string') {
        //Se agarran los valores firstName y lastName del registerForm
        const { firstName } = this.registerEmpresaForm.value;

        // Se actualiza los datos del usuario (estos son los propios de firebase)
        this.updateUserData(firstName);
        console.log(user);

        // Redirigir a wait-verification
        this.router.navigate(['/wait-verification']);
      } else {
        // Si user es un string, significa que hubo un error, por lo tanto se muestra
        this.errorMessage = user;
        this.seApretoElBoton = true;
      }
    } catch (error) {
      this.errorMessage = error.message;
      this.seApretoElBoton = true;
    }
  }

  async updateUserData(firstName) {
    (await this.authSvc.afAuth.currentUser).updateProfile({
      displayName: firstName,
    });
  }
}
