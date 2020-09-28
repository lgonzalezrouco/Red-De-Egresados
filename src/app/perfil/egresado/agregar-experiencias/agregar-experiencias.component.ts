import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-agregar-experiencias',
  templateUrl: './agregar-experiencias.component.html',
  styleUrls: ['./agregar-experiencias.component.scss'],
})
export class AgregarExperienciasComponent implements OnInit {
  // Es el formGroup de la primera parte del stepper
  firstFormGroup = new FormGroup({
    relacionDeCapacitacion: new FormControl('', [Validators.required]),
  });

  // Variables para controlar los patrones del formulario
  public relacionDeCapacitacionPattern = this.firstFormGroup.get(
    'relacionDeCapacitacion'
  );

  // Es el formGroup de la segunda parte del stepper
  secondFormGroup = new FormGroup({
    capacitacion: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    yearDeInicio: new FormControl('', [Validators.required]),
    yearDeFinal: new FormControl('', [Validators.required]),
    areaRelacionada: new FormControl('', [Validators.required]),
    lugarDeCapacitacion: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  // Variables para controlar los patrones del formulario
  public capacitacionPattern = this.secondFormGroup.get('capacitacion');
  public yearDeInicioPattern = this.secondFormGroup.get('yearDeInicio');
  public yearDeFinalPattern = this.secondFormGroup.get('yearDeFinal');
  public areaRelacionadaPattern = this.secondFormGroup.get('areaRelacionada');
  public lugarDeCapacitacionPattern = this.secondFormGroup.get(
    'lugarDeCapacitacion'
  );

  // Es el formGroup que se pasa a la base de datos y ambos formGroup anteriores en uno solo
  capacitacionForm = new FormGroup({
    relacionDeCapacitacion: new FormControl('', [Validators.required]),
    capacitacion: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
    yearDeInicio: new FormControl('', [Validators.required]),
    yearDeFinal: new FormControl('', [Validators.required]),
    areaRelacionada: new FormControl('', [Validators.required]),
    lugarDeCapacitacion: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
    ]),
  });

  // Variable para mostrar si hubo algun error en el formulario
  public errorMessage: string;

  // Se usa para almacenar todos los años de inicio y fin disponibles
  public yearsInicio;
  public yearsFinal;

  // Se usa para almacenar todas las areas disponibles
  public areas;

  public backgroundColorEgresado = '#ffffff';
  public backgroundColorEmpresa = '#ffffff';
  public srcImgEgresado = '../../../assets/images/eleccion_egresado.png';
  public srcImgEmpresa = '../../../assets/images/eleccion_empresa.png';

  public user: any;
  public userFirebase: any;
  public uid: any;

  constructor(
    private miscSvc: MiscService,
    private firestoreSvc: FirestoreService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario != 'egresado') {
      this.miscSvc.notAllowed(hayUnUsuario);
    } else {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
      this.uid = localStorage.getItem('uid');
    }
  }

  setFirstFormGroupEmpresa() {
    this.firstFormGroup.patchValue({
      relacionDeCapacitacion: 'empresa',
    });
    this.backgroundColorEmpresa = '#51799f';
    this.backgroundColorEgresado = '#ffffff';
    this.srcImgEmpresa = '../../../assets/images/empresaselec.png';
    this.srcImgEgresado = '../../../assets/images/eleccion_egresado.png';
    const { relacionDeCapacitacion } = this.firstFormGroup.value;
    console.log(relacionDeCapacitacion);
  }

  setFirstFormGroupEgresado() {
    this.firstFormGroup.patchValue({
      relacionDeCapacitacion: 'egresado',
    });
    this.backgroundColorEmpresa = '#ffffff';
    this.backgroundColorEgresado = '#51799f';
    this.srcImgEmpresa = '../../../assets/images/eleccion_empresa.png';
    this.srcImgEgresado = '../../../assets/images/egresadoselec.png';
    const { relacionDeCapacitacion } = this.firstFormGroup.value;
    console.log(relacionDeCapacitacion);
  }

  async onAddCapacitation(): Promise<void> {
    const { relacionDeCapacitacion } = this.firstFormGroup.value;
    const {
      capacitacion,
      yearDeInicio,
      yearDeFinal,
      areaRelacionada,
      lugarDeCapacitacion,
    } = this.secondFormGroup.value;

    // Se verifica que todos los datos sean validos
    if (
      relacionDeCapacitacion == '' ||
      capacitacion == '' ||
      yearDeInicio == '' ||
      yearDeFinal == '' ||
      areaRelacionada == '' ||
      lugarDeCapacitacion == ''
    ) {
      // Si no lo son tira un error
      this.errorMessage = 'Algunos de los campos estan incompletos';
      throw new Error(this.errorMessage);
    } else if (yearDeFinal != 'Actualidad' && yearDeInicio > yearDeFinal) {
      // Si no lo son tira un error
      this.errorMessage = 'La fecha de inicio es mayor a la de finalizacion';
      throw new Error(this.errorMessage);
    } else {
      this.capacitacionForm.patchValue({
        relacionDeCapacitacion: relacionDeCapacitacion,
        capacitacion: capacitacion,
        yearDeInicio: yearDeInicio,
        yearDeFinal: yearDeFinal,
        areaRelacionada: areaRelacionada,
        lugarDeCapacitacion: lugarDeCapacitacion,
      });

      try {
        await this.firestoreSvc.setCapacitacionesDeUser(
          this.capacitacionForm.value
        );
        this.router.navigate(['/perfil']);
      } catch (error) {
        console.log(error);
      }
    }
  }
}
