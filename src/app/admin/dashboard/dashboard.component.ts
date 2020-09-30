import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { MiscService } from 'src/app/shared/services/misc.service';
import { AgregarAdminComponent } from '../agregar-admin/agregar-admin.component';
import { AgregarTituloComponent } from '../agregar-titulo/agregar-titulo.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  fileReaded;
  titulos: any[];
  admins: any[];
  editar: boolean = false;
  idParaEditar;
  mensajeDeCargaABD: string;
  titulosASubir = [];

  constructor(
    private miscSvc: MiscService,
    private firestoreSvc: FirestoreService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    /* let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario == 'admin') {
      this.titulos = await this.firestoreSvc.getTitulos();
      this.ordenarTitulos();
      this.admins = await this.firestoreSvc.getAdmins();
      this.ordenarAdmins();
    } else {
      this.miscSvc.notAllowed(hayUnUsuario);
    } */
    this.titulos = await this.firestoreSvc.getTitulos();
    this.ordenarTitulos();
    this.admins = await this.firestoreSvc.getAdmins();
    this.ordenarAdmins();
  }

  convertFile(csv) {
    this.fileReaded = csv.target.files[0];

    let reader: FileReader = new FileReader();
    reader.readAsText(this.fileReaded);

    reader.onload = async (e) => {
      let csv: string = reader.result.toString();
      let allTextLines = csv.split(/\r|\n|\r/);
      let headers = allTextLines[0].split(';');
      let titulos = [];

      if (
        headers.includes('id') ||
        headers.includes('ID') ||
        headers.includes('DNI') ||
        headers.includes('dni')
      ) {
        for (let i = 1; i < allTextLines.length; i++) {
          const object = allTextLines[i].split(';');
          if (object.length === headers.length) {
            titulos.push(object);
          }
        }

        titulos.forEach((titulo) => {
          this.titulosASubir.push({
            id: titulo[0],
            DNI: titulo[1],
          });
        });
      } else {
        for (let i = 0; i < allTextLines.length; i++) {
          const object = allTextLines[i].split(';');
          if (object.length === headers.length) {
            titulos.push(object);
          }
        }

        titulos.forEach((titulo) => {
          this.titulosASubir.push({
            id: titulo[0],
            DNI: titulo[1],
          });
        });
      }
    };
  }

  async subirArchivo() {
    try {
      if (this.titulosASubir == []) {
        throw new Error('No hay nada para subir');
      } else {
        let respuesta = await this.firestoreSvc.uploadTitulos(
          this.titulosASubir
        );
        if (typeof respuesta !== 'string') {
          this.mensajeDeCargaABD = 'Se cargaron los titulos correctamente';
          this.titulos = await this.firestoreSvc.getTitulos();
          this.ordenarTitulos();
        } else {
          this.mensajeDeCargaABD = 'Hubo un problema al cargar los titulos';
        }
      }
    } catch (error) {
      this.mensajeDeCargaABD = error.message;
    }
  }

  editarTitulo(id, DNI) {
    if (!this.editar) {
      this.editar = true;
      this.idParaEditar = id;
    } else {
      this.editar = false;
      this.idParaEditar = undefined;
      this.firestoreSvc.editarTitulo(id, DNI);
    }
  }

  async cancelarEdicion() {
    this.editar = false;
    this.idParaEditar = undefined;
    this.titulos = await this.firestoreSvc.getTitulos();
    this.ordenarTitulos();
  }

  async eliminarTitulo(id, indice) {
    await this.firestoreSvc.eliminarTitulo(id);
    if (indice > -1) {
      this.titulos.splice(indice, 1);
    }
    console.log(this.titulos);
  }

  ordenarTitulos() {
    for (let i = 0; i < this.titulos.length; i++) {
      for (let j = 0; j < this.titulos.length - 1; j++) {
        let tempDigitsI: string = this.titulos[j].id;
        let digitsI: number;
        tempDigitsI = tempDigitsI.slice(5);
        digitsI = Number(tempDigitsI);

        let tempDigitsJ: string = this.titulos[j + 1].id;
        let digitsJ: number;
        tempDigitsJ = tempDigitsJ.slice(5);
        digitsJ = Number(tempDigitsJ);

        if (digitsI > digitsJ) {
          let tmp = this.titulos[j];
          this.titulos[j] = this.titulos[j + 1];
          this.titulos[j + 1] = tmp;
        }
      }
    }
  }

  ordenarAdmins() {
    for (let i = 0; i < this.admins.length; i++) {
      for (let j = 0; j < this.admins.length - 1; j++) {
        let lastNameI: string = this.admins[j].lastName;

        let lastNameJ: string = this.admins[j + 1].lastName;

        if (lastNameI > lastNameJ) {
          let tmp = this.admins[j];
          this.admins[j] = this.admins[j + 1];
          this.admins[j + 1] = tmp;
        }
      }
    }
  }

  abrirFormularioDeTitulo() {
    let dialogRef = this.dialog.open(AgregarTituloComponent);
    dialogRef.afterClosed().subscribe(async () => {
      this.titulos = await this.firestoreSvc.getTitulos();
      this.ordenarTitulos();
    });
  }

  abrirFormularioDeRegistroDeAdmin() {
    let dialogRef = this.dialog.open(AgregarAdminComponent);
    dialogRef.afterClosed().subscribe(async () => {
      this.admins = await this.firestoreSvc.getAdmins();
      this.ordenarAdmins();
    });
  }

  async eliminarAdmin(id, indice) {
    await this.firestoreSvc.eliminarAdmin(id);
    if (indice > -1) {
      this.admins.splice(indice, 1);
    }
  }

  async prueba() {
    this.titulos = await this.firestoreSvc.getFewTitulos(5);
    let lengthTitulos = this.titulos.length;
    console.log(this.titulos);
    this.titulos = await this.firestoreSvc.getFewTitulos(
      5,
      this.titulos[lengthTitulos - 1]
    );
    console.log(this.titulos);
  }
}
