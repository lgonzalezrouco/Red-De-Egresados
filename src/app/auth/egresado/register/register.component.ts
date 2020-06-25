import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective,NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import {ErrorStateMatcher} from '@angular/material/core';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
interface Profesion {
  value: string;
  viewValue: string;
}
interface Fecha {
  value1: number;
  viewValue1: number;
}
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {

  maxDate= new Date(2020,0,0);
  hide = true;
  profesions: Profesion[] = [
    {value: 'desarrolloWeb', viewValue: 'Desarrollo Web'},
    {value: 'fotografia', viewValue: 'Fotografía'},
  ];
  fechas: Fecha[] = [
    {value1: 2018 , viewValue1: 2018},
    {value1: 2019, viewValue1: 2019},
  ];




  matcher = new MyErrorStateMatcher();
  public categoriasSeleccionadas: string[] = [];

  /*registerForm = new FormGroup({
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
  });*/
  registerForm = new FormGroup({
    nombreFormControl : new FormControl('', [
      Validators.required,
    ]),
    emailFormControl : new FormControl('', [
      Validators.required,
      Validators.email,
    ]),

    apellidoFormControl : new FormControl('', [
      Validators.required,
    ]),
    fechaNacimientoFormControl : new FormControl('', [
      Validators.required,
    ]),
    contrasenaFormControl : new FormControl('', [
      Validators.required,
    ]),
    dniFormControl : new FormControl('', [
      Validators.required,
      Validators.min(1000000),
    ]),
   telefonoFormControl : new FormControl('', [
      Validators.required,
    ]),
    sexoFormControl : new FormControl('', [
      Validators.required,
    ]),
    orientacionFormControl : new FormControl('', [
      Validators.required,
    ]),
    profesionFormControl : new FormControl('', [
      Validators.required,
    ]),
    tituloFormControl : new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    fechaEgresoFormControl : new FormControl('', [
      Validators.required,

    ]),
  });
  // Variables para controlar los patrones del formulario
  public mail = this.registerForm.get('emailFormControl');
  public contrasena = this.registerForm.get('contrasenaFormControl');
  public nombre = this.registerForm.get('nombreFormControl');
  public apellido = this.registerForm.get('apellidoFormControl');
  public fechaNacimiento = this.registerForm.get('fechaNacimientoFormControl');
  public sexo = this.registerForm.get('sexoFormControl');
  public telefono = this.registerForm.get('telefonoFormControl');
  public fechaEgreso = this.registerForm.get('fechaEgresoFormControl');
  public orientacion = this.registerForm.get('orientacionFormControl');
  public profesion = this.registerForm.get('profesionFormControl');
  public dni = this.registerForm.get('dniFormControl');
  public titulo = this.registerForm.get('tituloFormControl');

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
  mostrar(){
    console.log(this.registerForm.get("nombreFormControl").value);
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

              // Redirigir a wait-verification
              this.router.navigate(['/wait-verification']);
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
