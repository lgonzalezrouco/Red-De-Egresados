import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest } from 'rxjs';
import { Titulos } from 'src/app/shared/interfaces/titulos';
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
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'Título',
    'DNI',
    'Nombre',
    'Apellido',
    'Año de Egreso',
    'editar',
    'eliminar',
  ];
  dataSource: MatTableDataSource<Titulos>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  fileReaded;
  editar: boolean = false;
  idParaEditar;
  mensajeDeCargaABD: string;
  titulosASubir = [];
  titulos: Titulos[];

  constructor(
    private miscSvc: MiscService,
    private firestoreSvc: FirestoreService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    this.titulos = await this.firestoreSvc.getTitulos();
    this.dataSource = new MatTableDataSource(this.titulos);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
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
      let containsNumber: boolean = false;
      for (let i = 0; i < headers.length; i++) {
        if (headers[i].match(/^[0-9]+$/)) {
          containsNumber = true;
          break;
        }
      }
      if (!containsNumber) {
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
            nroDeAlumno: titulo[2],
            apellido: titulo[3],
            nombre: titulo[4],
            yearDeEgreso: titulo[5],
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
            nroDeAlumno: titulo[2],
            apellido: titulo[3],
            nombre: titulo[4],
            yearDeEgreso: titulo[5],
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
          this.dataSource = new MatTableDataSource(this.titulos);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.mensajeDeCargaABD = 'Hubo un problema al cargar los titulos';
        }
      }
    } catch (error) {
      this.mensajeDeCargaABD = error.message;
    }
  }

  editarTitulo(id, DNI, nombre, apellido, nroDeAlumno, yearDeEgreso) {
    if (!this.editar) {
      this.editar = true;
      this.idParaEditar = id;
    } else {
      this.editar = false;
      this.idParaEditar = undefined;
      this.firestoreSvc.editarTitulo(
        id,
        DNI,
        nombre,
        apellido,
        nroDeAlumno,
        yearDeEgreso
      );
    }
  }

  async cancelarEdicion() {
    this.editar = false;
    this.idParaEditar = undefined;
    this.titulos = await this.firestoreSvc.getTitulos();
    this.dataSource = new MatTableDataSource(this.titulos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async eliminarTitulo(titulo) {
    await this.firestoreSvc.eliminarTitulo(titulo);
    let indice: number;
    for (let i = 0; i < this.titulos.length; i++) {
      if(this.titulos[i].titulo == titulo) {
        indice = i
        break;
      } ;
    }
    console.log(titulo, indice);
    if (indice > -1) {
      this.titulos.splice(indice, 1);
    }
    this.dataSource = new MatTableDataSource(this.titulos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* ordenarTitulos() {
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
  } */

  abrirFormularioDeTitulo() {
    let dialogRef = this.dialog.open(AgregarTituloComponent);
    dialogRef.afterClosed().subscribe(async () => {
      this.titulos = await this.firestoreSvc.getTitulos();
      this.dataSource = new MatTableDataSource(this.titulos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
}
