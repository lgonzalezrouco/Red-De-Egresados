import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '@app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {

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
    areasDeConocimiento: new FormControl('', [Validators.required]),
  });

  // Variables para controlar los patrones del formulario
  public firstNamePattern = this.editarForm.get('firstName');
  public lastNamePattern = this.editarForm.get('lastName');
  public birthdayPattern = this.editarForm.get('birthday');
  public genderPattern = this.editarForm.get('gender');
  public cellphonePattern = this.editarForm.get('cellphone');
  public areasDeConocimientoPattern = this.editarForm.get(
    'areasDeConocimiento'
  );

  // Variable para guardar los datos del usuario
  public user: any;

  // Variable para saber si se tiene que mostrar el formulario editable
  public mostrar: boolean = true;

  // Variables para la subida de fotos al Storage
  public nombreArchivo = '';
  public mensajeArchivo = 'No hay archivo seleccionado';
  public datosFormulario = new FormData();
  public URLPublica: string;
  public porcentaje = 0;
  public finalizado = false;

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: any;

  // Se usa para saber si el usuario ofrece servicios o no.
  public ofreceServicio: boolean;

  constructor(
    public authSvc: AuthService,
    public router: Router,
    public ngZone: NgZone
  ) {}

  ngOnInit(): void {
    try {
      this.authSvc.afAuth.user.subscribe((u) => {
        if (u) {
          this.authSvc.getUser(u.uid).subscribe((userSnapshot) => {
            this.user = userSnapshot.payload.data();
            console.log(userSnapshot.payload.exists);
            console.log(this.user);
            if (
              this.user.serviceDescription != '' &&
              this.user.serviceDescription != null
            ) {
              this.ofreceServicio = true;
            } else {
              this.ofreceServicio = false;
            }
          });
        } else {
          console.log('Nadie inicio sesion');
        }
      });
    } catch (error) {
      console.log(error);
    }
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
  }
}
