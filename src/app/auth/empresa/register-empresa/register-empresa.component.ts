import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-empresa',
  templateUrl: './register-empresa.component.html',
  styleUrls: ['./register-empresa.component.scss'],
})
export class RegisterEmpresaComponent implements OnInit {

  registerEmpresaForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    empresaName: new FormControl('', [
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
  public empresaNamePattern = this.registerEmpresaForm.get('empresaName');
  public cuitPattern = this.registerEmpresaForm.get('CUIT');

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: string;

  // Variable para saber si la contraseña es visible o no
  public hide = true;

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    if(user && uid){
      if(user.empresa && uid){
        this.router.navigate(['/perfil-empresa']);
      } else if(!user.empresa && uid) {
        this.router.navigate(['/perfil']);
      }
    }
  }

  onRegister(){
    try {
      this.createUser();
    } catch (error) {
      console.log(error);
    }
  }

  async updateUserData(empresaName) {
    (await this.authSvc.afAuth.currentUser).updateProfile({
      displayName: empresaName
    });
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
        const { empresaName } = this.registerEmpresaForm.value;

        // Se actualiza los datos del usuario (estos son los propios de firebase)
        this.updateUserData(empresaName);
        console.log(user);

        // Redirigir a wait-verification
        this.router.navigate(['/wait-verification']);
      } else {
        // Si user es un string, significa que hubo un error, por lo tanto se muestra
        this.errorMessage = user;
        console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  }
}
