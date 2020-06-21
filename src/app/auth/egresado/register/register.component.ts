import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  public categoriasSeleccionadas: string[] = [];

  registerForm = new FormGroup({
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
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
    cellphone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
    birthday: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    yearDeEgreso: new FormControl('', [Validators.required]),
    orientacion: new FormControl('', [Validators.required]),
    areasDeConocimiento: new FormControl('', [Validators.required]),
    DNI: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    tituloEgreso: new FormControl('', [Validators.required]),
  });

  // Variables para controlar los patrones del formulario
  public emailPattern = this.registerForm.get('email');
  public passwordPattern = this.registerForm.get('password');
  public firstNamePattern = this.registerForm.get('firstName');
  public lastNamePattern = this.registerForm.get('lastName');
  public birthdayPattern = this.registerForm.get('birthday');
  public genderPattern = this.registerForm.get('gender');
  public cellphonePattern = this.registerForm.get('cellphone');
  public egresoPattern = this.registerForm.get('yearDeEgreso');
  public orientacionPattern = this.registerForm.get('orientacion');
  public areasDeConocimientoPattern = this.registerForm.get(
    'areasDeConocimiento'
  );
  public DNIPattern = this.registerForm.get('DNI');
  public tituloEgresoPattern = this.registerForm.get('tituloEgreso');

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: string;

  public egresado;

  constructor(private authSvc: AuthService, private router: Router) {}

  ngOnInit(): void {}

  async onRegister() {
    try {
      this.createUser();
    } catch (error) {
      console.log(error);
    }
  }

  // Se usa para actualizar los datos del usuario propios de firebase
  async updateUserData(firstName, lastName) {
    (await this.authSvc.afAuth.currentUser).updateProfile({
      displayName: firstName + ' ' + lastName,
    });
  }

  async createUser() {
    // guarda los valores del email, password, photoURL, firstName y lastName
    const { email, password, DNI, tituloEgreso } = this.registerForm.value;
    let user;
    let existeEgresado: boolean;
    let DNIEnFirestore: number;

    try {
      // Verifica si el titulo de Egreso que fue proveido existe
      this.authSvc
        .existeElEgresado(tituloEgreso)
        .subscribe(async (userSnapshot) => {
          this.egresado = userSnapshot.payload.data();
          existeEgresado = userSnapshot.payload.exists;
          // Si el titulo existe...
          if (existeEgresado) {
            // Se guarda el DNI en una variable
            DNIEnFirestore = this.egresado.DNI;
          }

          // Si el DNI y el titulo de Egreso coninciden...
          if (DNIEnFirestore == DNI && existeEgresado) {
            // Intenta hacer el register con los datos del formulario
            user = await this.authSvc.register(
              email,
              password,
              this.registerForm.value
            );

            // Si el resultado de la operacion no es un string o undefined (osea que no devolvio un error)...
            console.log(user);
            if (typeof user !== 'string' && user != undefined) {
              //Se agarran los valores firstName y lastName del registerForm
              const { firstName, lastName } = this.registerForm.value;

              // Se actualiza los datos del usuario (estos son los propios de firebase)
              this.updateUserData(firstName, lastName);
              console.log(user);

              // Redirigir a verificationEmail
              this.router.navigate(['/verification-email']);
            } else {
              // Si user es un undefined, significa que hubo un error, por lo tanto se muestra
              if (user == undefined) {
                console.log('LLegue aca');
                this.errorMessage =
                  'El titulo de egreso o el DNI el incorrecto';
              } else {
                // Si user es un string, significa que hubo un error, por lo tanto se muestra
                this.errorMessage = user;
                console.log(user);
              }
            }
          } else {
            // Si no coinciden se muestra el mensaje en la pantalla.
            this.errorMessage = 'El titulo de egreso o el DNI el incorrecto';
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}
