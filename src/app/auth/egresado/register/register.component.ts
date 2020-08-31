import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  /* FormGroupDirective,
  NgForm, */
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
/* import { ErrorStateMatcher } from '@angular/material/core'; */
import { Router } from '@angular/router';
/* import { Profesion } from 'src/app/shared/interfaces/profesion';
import { EgresoYear } from 'src/app/shared/interfaces/egresoYear'; */
import { HttpClient } from '@angular/common/http';

/* export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
} */
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [AuthService],
})
export class RegisterComponent implements OnInit {
  // Se usa para establecer la fecha maxima, el dia de hoy.
  today = new Date();
  todayYear: number = this.today.getFullYear();
  todayMonth: number = this.today.getMonth();
  todayDay: number = this.today.getDate();

  maxDate = new Date(this.todayYear, this.todayMonth, this.todayDay);

  // Se usa para saber si se tiene que mostrar la contraseña o no
  hide = true;

  // Es el formGroup de la primera parte del stepper
  firstFormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
    cellphone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(8),
    ]),
    lastName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
    birthday: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    yearDeEgreso: new FormControl('', [Validators.required]),
  });

  // Variables para controlar los patrones del formulario
  public firstNamePattern = this.firstFormGroup.get('firstName');
  public lastNamePattern = this.firstFormGroup.get('lastName');
  public birthdayPattern = this.firstFormGroup.get('birthday');
  public genderPattern = this.firstFormGroup.get('gender');
  public cellphonePattern = this.firstFormGroup.get('cellphone');
  public egresoPattern = this.firstFormGroup.get('yearDeEgreso');

  // Es el formGroup de la segunda parte del stepper
  secondFormGroup = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    orientacion: new FormControl('', [Validators.required]),
    profesion: new FormControl('', [Validators.required]),
    DNI: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    tituloEgreso: new FormControl('', [Validators.required]),
  });

  // Variables para controlar los patrones del formulario
  public emailPattern = this.secondFormGroup.get('email');
  public passwordPattern = this.secondFormGroup.get('password');
  public orientacionPattern = this.secondFormGroup.get('orientacion');
  public profesionPattern = this.secondFormGroup.get('profesion');
  public DNIPattern = this.secondFormGroup.get('DNI');
  public tituloEgresoPattern = this.secondFormGroup.get('tituloEgreso');

  // Es el formGroup que se pasa a la base de datos y ambos formGroup anteriores en uno solo
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
    profesion: new FormControl('', [Validators.required]),
    DNI: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    tituloEgreso: new FormControl('', [Validators.required]),
  });

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: string;

  // Se usa para almacenar la informacion del titulo del egresado
  public egresado;

  // Se usa para almacenar todos los años de egreso disponibles
  public years;

  // Se usa para almacenar todas las profesiones disponibles
  public profesions;

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    console.log(user);
    if(user && uid){
      if(!userFirebase.emailVerified){
        this.router.navigate(['/wait-verification']);
      } else {
        if(user.empresa && uid){
          this.router.navigate(['/perfil-empresa']);
        } else if(!user.empresa && uid) {
          this.router.navigate(['/perfil']);
        }
      }
    } else {
      // Almacena la informacion de los json en las variables
      this.years = this.http.get('../../../../assets/JSON/egresoYear.json');
      this.profesions = this.http.get('../../../../assets/JSON/profesion.json');
    }
  }

  async onRegister() {
    try {
      // Se agarran los datos del primer formGroup
      const {
        firstName,
        cellphone,
        lastName,
        gender,
        yearDeEgreso,
        birthday,
      } = this.firstFormGroup.value;

      // Se agarran los datos del segundo formGroup
      const {
        email,
        password,
        DNI,
        tituloEgreso,
        orientacion,
        profesion,
      } = this.secondFormGroup.value;

      // Se verifica que todos los datos sean validos
      if (
        email == '' ||
        password == '' ||
        DNI == '' ||
        tituloEgreso == '' ||
        firstName == '' ||
        cellphone == '' ||
        lastName == '' ||
        birthday == '' ||
        gender == '' ||
        yearDeEgreso == '' ||
        orientacion == '' ||
        profesion == ''
      ) {
        // Si no lo son tira un error
        this.errorMessage = 'Algunos de los campos estan incompletos';
        throw new Error(this.errorMessage);
      }
      // Si son validos, se unifican todos los datos en un solo formGroup
      this.registerForm.patchValue({
        email: email,
        password: password,
        firstName: firstName,
        cellphone: cellphone,
        lastName: lastName,
        birthday: birthday,
        gender: gender,
        yearDeEgreso: yearDeEgreso,
        orientacion: orientacion,
        profesion: profesion,
        DNI: DNI,
        tituloEgreso: tituloEgreso,
      });
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
    // Guarda los datos del usuario registrado o un error
    let user;
    // Se usa para saber si existe el titulo del egresado
    let existeEgresado: boolean;
    // Se usa para verificar el DNI en la DB
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
          } else {
            // Pero si no, tira un error
            this.errorMessage = 'Ese titulo de egresado no existe';
            throw new Error(this.errorMessage);
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
            throw new Error(this.errorMessage);
          }
        });
    } catch (error) {
      console.log(error);
    }
  }
}
