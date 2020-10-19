import { HttpClient } from '@angular/common/http';
import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GithubUser } from 'src/app/shared/interfaces/githubUser';
import { User } from 'src/app/shared/interfaces/user';
import { ApisService } from 'src/app/shared/services/apis.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestorageService } from 'src/app/shared/services/firestorage.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { MiscService } from 'src/app/shared/services/misc.service';
import { RedesFormComponent } from '../redes-form/redes-form.component';

@Component({
  selector: 'app-perfil-egresado',
  templateUrl: './perfil-egresado.component.html',
  styleUrls: ['./perfil-egresado.component.scss'],
})
export class PerfilEgresadoComponent implements OnInit {
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
    descripcion: new FormControl(''),
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
  public uid;
  public userFirebase;
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
    private authSvc: AuthService,
    private miscSvc: MiscService,
    private apiSvc: ApisService,
    private firestorageSvc: FirestorageService,
    private firestoreSvc: FirestoreService,
    private router: Router,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario == 'egresado') {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
      this.uid = localStorage.getItem('uid');
      this.capacitaciones = localStorage.getItem('capacitaciones');
      await this.miscSvc.getSocialOfLoggedUser(this.uid);
      this.social = JSON.parse(localStorage.getItem('social'));
      this.getCapacitaciones();
      console.log(this.social);
      await this.getGithubCard();
      /* const timestamp = this.user.birthday.seconds;
      this.fechaDeNacimiento = new Date(timestamp * 1000); */
      this.fechaDeNacimiento = new Date(this.user.birthday.seconds * 1000);

      // Almacena la informacion de los json en las variables
      this.profesions = this.http.get('../../../../assets/JSON/profesion.json');
    } else {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  public cambioArchivo(event) {
    if (event.target.files.length > 0) {
      if (
        event.target.files[0].type == 'image/jpeg' ||
        event.target.files[0].type == 'image/jpg' ||
        event.target.files[0].type == 'image/png'
      ) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.mensajeArchivo = `Archivo preparado: ${event.target.files[i].name}`;
          this.nombreArchivo = this.user.uid + '-foto-de-perfil';
          this.datosFormulario.delete('archivo');
          this.datosFormulario.append(
            'archivo',
            event.target.files[i],
            event.target.files[i].name
          );
        }
      } else {
        this.mensajeArchivo =
          'El formato del archivo no es valido (solo JPG, PNG o JPEG)';
      }
    } else {
      this.mensajeArchivo = 'No hay un archivo seleccionado';
    }
  }

  // Se usa para actualizar los datos del usuario propios de firebase
  async updateUserData(firstName, lastName, photoURL) {
    (await this.authSvc.afAuth.currentUser).updateProfile({
      displayName: firstName + ' ' + lastName,
      photoURL: photoURL,
    });
  }

  public async editar() {
    if (this.mostrar) {
      this.mostrar = false;
    } else {
      this.mostrar = true;
      let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
      if (hayUnUsuario == 'egresado') {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
        this.uid = localStorage.getItem('uid');
        this.getGithubCard();
        this.fechaDeNacimiento = new Date(this.user.birthday.seconds * 1000);
      }
    }
  }

  async onEdit() {
    try {
      this.finalizado = false;
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

    this.editUser();
  }

  // Se encarga de actualizar los datos del usuario, si entre esos datos hay una foto
  updateUserWithPhoto() {
    let archivo = this.datosFormulario.get('archivo');
    const referencia = this.firestorageSvc.referenciaCloudStorage(
      this.nombreArchivo
    );
    const tarea = this.firestorageSvc.tareaCloudStorage(
      this.nombreArchivo,
      archivo
    );

    tarea.percentageChanges().subscribe(async (porcentaje) => {
      this.porcentaje = Math.round(porcentaje);
      if (this.porcentaje == 100 && this.finalizado == false) {
        this.finalizado = true;
        await referencia
          .getDownloadURL()
          .toPromise()
          .then((res) => {
            this.URLPublica = res;
          });
        /* referencia.getDownloadURL().subscribe((URL) => {
          this.URLPublica = URL;
        }); */
        this.editUser();
      }
    });
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

      const user = await this.firestoreSvc.editUser(
        this.user,
        this.editarForm.value,
        this.URLPublica
      );

      // Si el resultado de la operacion no es un string (osea que no devolvio un error)
      if (typeof user !== 'string') {
        //Se agarran los valores firstName y lastName del registerForm
        const { firstName, lastName } = this.editarForm.value;

        // Se actualiza los datos del usuario (estos son los propios de firebase)
        await this.updateUserData(firstName, lastName, this.URLPublica);

        console.log(user);

        await this.editar();
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
    await this.firestoreSvc
      .getCapacitaciones(this.uid)
      .then((capacitaciones) => {
        console.log(capacitaciones);
        this.capacitaciones = capacitaciones.capacitaciones;
        this.capacitacionesLength = this.capacitaciones.length;
        let i: number = 0;
        for (const capacitacion of this.capacitaciones) {
          i = i + 1;
        }
      });
  }

  async editarCapacitaciones() {
    if (this.mostrarEdicionCapacitaciones) {
      this.mostrarEdicionCapacitaciones = false;
    } else {
      this.mostrarEdicionCapacitaciones = true;
    }
  }

  async borrarCapacitacion(indice) {
    this.capacitaciones = await this.firestoreSvc.deleteCapacitacion(indice);
    this.editarCapacitaciones();
  }

  async editarRedes() {
    if (this.mostrarEdicionRedes) {
      this.mostrarEdicionRedes = false;
    } else {
      this.mostrarEdicionRedes = true;
      await this.miscSvc.getSocialOfLoggedUser();
      this.social = JSON.parse(localStorage.getItem('social'));
    }
  }

  abrirFormularioDeInstagram() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Instagram', user: user },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.editarRedes();
    });
  }

  abrirFormularioDeBehance() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Behance', user: user },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.editarRedes();
    });
  }

  abrirFormularioDeFlickr() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Flickr', user: user },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.editarRedes();
    });
  }

  abrirFormularioDeFacebook() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'Facebook', user: user },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.editarRedes();
    });
  }

  abrirFormularioDeGithub() {
    let user: User = this.user;
    let dialogRef = this.dialog.open(RedesFormComponent, {
      data: { uid: this.uid, red: 'GitHub', user: user },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      await this.editarRedes();
    });
  }

  getGithubRepos() {
    const url = this.githubUser.repos_url;
    return this.http.get<any>(url).toPromise();
  }

  async getGithubCard() {
    this.githubUser = await this.apiSvc.getGithubUser(
      this.social.githubUsername
    );
    await this.getGithubRepos().then((result) => {
      this.githubRepos = result;
      this.githubRepos = this.githubRepos.slice(0, 3);
    });
  }
}
