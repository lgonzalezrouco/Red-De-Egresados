import { Component, OnInit, NgZone, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { User } from 'src/app/shared/interfaces/user';
import { Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RedesFormComponent } from '../redes-form/redes-form.component';
import { GithubUser } from 'src/app/shared/interfaces/githubUser';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  // Se usa para establecer la fecha maxima, el dia de hoy.
  today = new Date();
  todayYear: number = this.today.getFullYear();
  todayMonth: number = this.today.getMonth();
  todayDay: number = this.today.getDate();

  maxDate = new Date(this.todayYear, this.todayMonth, this.todayDay);

  editarForm = new FormGroup({
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
    profesion: new FormControl('', [Validators.required]),
    photoURL: new FormControl(''),
  });

  // Variables para controlar los patrones del formulario
  public firstNamePattern = this.editarForm.get('firstName');
  public lastNamePattern = this.editarForm.get('lastName');
  public birthdayPattern = this.editarForm.get('birthday');
  public genderPattern = this.editarForm.get('gender');
  public cellphonePattern = this.editarForm.get('cellphone');
  public profesionPattern = this.editarForm.get('profesion');

  githubForm = new FormGroup({
    githubUsername: new FormControl('', [Validators.required]),
  });

  // Variable para guardar los datos del usuario
  public user: any;
  public userAux: User;
  public uid;
  public capacitaciones;
  public capacitacionesLength: number;
  public social;
  public githubUser: GithubUser;
  public githubRepos;

  // Variable para saber si se tiene que mostrar el formulario editable
  public mostrar: boolean = true;
  public mostrarEdicionCapacitaciones: boolean = false;
  public mostrarEdicionRedes: boolean = false;

  // Variables para la subida de fotos al Storage
  public nombreArchivo = '';
  public mensajeArchivo = 'No hay archivo seleccionado';
  public datosFormulario = new FormData();
  public URLPublica: string;
  public porcentaje = 0;
  public finalizado = false;

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: any;

  // Se usa para almacenar todas las profesiones disponibles
  public profesions;

  // Se usa para mostrar la fecha de nacimiento en el formato correcto
  public fechaDeNacimiento: Date;

  constructor(
    public authSvc: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public http: HttpClient,
    private dialog: MatDialog,
    private renderer2: Renderer2,
    private element: ElementRef,
    @Inject(DOCUMENT) private _document
  ) {}

  async ngOnInit(): Promise<void> {
    const s = this.renderer2.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://unpkg.com/github-card@1.2.1/dist/widget.js';
    s.text = ``;
    this.renderer2.appendChild(this._document.body, s);
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    await this.authSvc.getSocial();
    this.user = JSON.parse(localStorage.getItem('user'));
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    this.uid = localStorage.getItem('uid');
    this.capacitaciones = localStorage.getItem('capacitaciones');
    this.social = JSON.parse(localStorage.getItem('social'));
    console.log(this.user);
    if (this.user && this.uid) {
      if (!userFirebase.emailVerified) {
        this.router.navigate(['/wait-verification']);
      } else {
        if (this.user.empresa && this.uid) {
          this.router.navigate(['/perfil-empresa']);
        } else {
          this.getCapacitaciones();
          this.githubUser = await this.authSvc.getGithubUser(
            this.social.githubUsername
          );
          this.getGithubRepos().then((result) => {
            this.githubRepos = result;
            this.githubRepos = this.githubRepos.slice(0, 3);
          });
        }
      }
    }
    this.userAux = this.user;

    const timestamp = this.user.birthday.seconds;
    this.fechaDeNacimiento = new Date(timestamp * 1000);
    console.log(this.fechaDeNacimiento);

    // Almacena la informacion de los json en las variables
    this.profesions = this.http.get('../../../../assets/JSON/profesion.json');
  }

  public cambioArchivo(event) {
    console.log('Llegue 0');
    if (event.target.files.length > 0) {
      if (
        event.target.files[0].type == 'image/jpeg' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/png'
      ) {
        console.log(event.target.files);
        for (let i = 0; i < event.target.files.length; i++) {
          this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
          this.nombreArchivo = event.target.files[i].name;
          this.datosFormulario.delete('archivo');
          this.datosFormulario.append(
            'archivo',
            event.target.files[i],
            event.target.files[i].name
          );
        }
        console.log('Llegue 1');
        console.log(this.datosFormulario.get('archivo'));
      } else {
        this.mensajeArchivo =
          'El formato del archivo no es valido (solo JPG, PNG o JPEG)';
        console.log('Llegue 1,5');
      }
      console.log('Llegue 1');
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
      console.log('Llegue 1,5');
    }
  }

  // Se usa para actualizar los datos del usuario propios de firebase
  async updateUserData(firstName, lastName, photoURL) {
    (await this.authSvc.afAuth.currentUser).updateProfile({
      displayName: firstName + ' ' + lastName,
      photoURL: photoURL,
    });
  }

  public editar() {
    if (this.mostrar) {
      this.mostrar = false;
    } else {
      this.mostrar = true;
      window.location.replace(this.router.url);
    }
  }

  async onEdit() {
    try {
      // Verifica si el usuario metio un archivo para cambiar
      if (this.datosFormulario.get('archivo') != null) {
        // Se encarga de actualizar los datos del usuario, si entre esos datos hay una foto
        this.updateUserWithPhoto();
      } else {
        // Se encarga de actualizar los datos del usuario, si entre esos NO datos hay una foto
        this.updateUserWithoutPhoto();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Se encarga de actualizar los datos del usuario, si entre esos datos NO hay una foto
  async updateUserWithoutPhoto() {
    // Si no se ingresa una foto de perfil nueva, se agarra el link de la que ya estaba
    this.URLPublica = (await this.authSvc.afAuth.currentUser).photoURL;

    console.log('Llegue 10');
    console.log(this.URLPublica);

    this.editUser();
  }

  // Se encarga de actualizar los datos del usuario, si entre esos datos hay una foto
  updateUserWithPhoto() {
    console.log('Llegue aca 2');
    let archivo = this.datosFormulario.get('archivo');
    console.log('Llegue aca 3');
    const referencia = this.authSvc.referenciaCloudStorage(this.nombreArchivo);
    const tarea = this.authSvc.tareaCloudStorage(this.nombreArchivo, archivo);
    console.log('Llegue aca 4');

    tarea.percentageChanges().subscribe((porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100) {
        this.finalizado = true;
        console.log('LLEGUE ACA 6');
        referencia.getDownloadURL().subscribe((URL) => {
          this.URLPublica = URL;
        });
        console.log(this.URLPublica);
        console.log('LLEGUE ACA 7');

        this.editUser();
      }
    });
    console.log('Llegue aca 5');
    referencia.getDownloadURL().subscribe((URL) => {
      this.URLPublica = URL;
    });
    console.log(this.URLPublica);
  }

  async editUser() {
    try {
      const {
        firstName,
        cellphone,
        lastName,
        gender,
        profesion,
        birthday,
      } = this.editarForm.value;

      if (
        firstName == '' ||
        lastName == '' ||
        cellphone == '' ||
        gender == '' ||
        profesion == '' ||
        birthday == ''
      ) {
        throw new Error('Algunos de los campos estan incompletos');
      }

      const user = await this.authSvc.editUser(
        this.user,
        this.editarForm.value,
        this.URLPublica
      );

      // Si el resultado de la operacion no es un string (osea que no devolvio un error)
      if (typeof user !== 'string') {
        //Se agarran los valores firstName y lastName del registerForm
        const { firstName, lastName } = this.editarForm.value;

        // Se actualiza los datos del usuario (estos son los propios de firebase)
        this.updateUserData(firstName, lastName, this.URLPublica);

        console.log(user);

        this.editar();
      } else {
        // Si user es un string, significa que hubo un error, por lo tanto se muestra
        this.errorMessage = user;
        console.log(user);
      }
    } catch (error) {
      this.errorMessage = error;
    }
  }

  goToAgregarExperiencia() {
    this.router.navigate(['/agregar-experiencias']);
  }

  async getCapacitaciones() {
    await this.authSvc.getCapacitaciones(this.uid).then((capacitaciones) => {
      console.log(capacitaciones);
      this.capacitaciones = capacitaciones.capacitaciones;
      this.capacitacionesLength = this.capacitaciones.length;
      let i: number = 0;
      for (const capacitacion of this.capacitaciones) {
        console.log(i);
        i = i + 1;
        console.log(capacitacion);
      }
    });
  }

  editarCapacitaciones() {
    if (this.mostrarEdicionCapacitaciones) {
      this.mostrarEdicionCapacitaciones = false;
      window.location.reload();
    } else {
      this.mostrarEdicionCapacitaciones = true;
    }
  }

  async borrarCapacitacion(indice) {
    await this.authSvc.deleteCapacitacion(indice);
    window.location.reload();
  }

  editarRedes() {
    if (this.mostrarEdicionRedes) {
      this.mostrarEdicionRedes = false;
      window.location.reload();
    } else {
      this.mostrarEdicionRedes = true;
    }
  }

  abrirFormularioDeInstagram() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Instagram', user: user },
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  abrirFormularioDeBehance() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Behance', user: user },
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  abrirFormularioDeFlickr() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Flickr', user: user },
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  abrirFormularioDeFacebook() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Facebook', user: user },
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  abrirFormularioDeGithub() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'GitHub', user: user },
    });

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload()
    });
  }

  getGithubRepos() {
    const url = this.githubUser.repos_url;
    return this.http.get<any>(url).toPromise();
  }

}
