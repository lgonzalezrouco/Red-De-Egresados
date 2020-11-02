import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, combineLatest, of } from 'rxjs';
import { Titulos } from 'src/app/shared/interfaces/titulos';
import { User } from 'src/app/shared/interfaces/user';
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
  DNIParaEditar;
  mensajeDeCargaABD: string;
  titulosASubir = [];
  titulos: Titulos[];

  constructor(
    private miscSvc: MiscService,
    private firestoreSvc: FirestoreService,
    private dialog: MatDialog
  ) {}

  async ngOnInit(): Promise<void> {
    await this.miscSvc.getUserAndUID();
    const user: User = JSON.parse(localStorage.getItem('user'));
    if (user) {
      let admin: boolean = await this.miscSvc.getAdmin(user.email);
      if (admin) {
        this.titulos = await this.firestoreSvc.getTitulos();
        console.log(this.titulos)
        this.dataSource = new MatTableDataSource(this.titulos);
      } else {
        let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
        await this.miscSvc.notAllowed(hayUnUsuario);
      }
    } else {
      let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
      await this.miscSvc.notAllowed(hayUnUsuario);
    }
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
            DNI: titulo[0],
            apellido: titulo[1],
            nombre: titulo[2],
            yearDeEgreso: titulo[3],
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
            DNI: titulo[0],
            apellido: titulo[1],
            nombre: titulo[2],
            yearDeEgreso: titulo[3],
          });
        });
      }
    };
  }

  async subirArchivo() {
    try {
      console.log(this.titulosASubir)
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

  editarTitulo(DNI, nombre, apellido, yearDeEgreso) {
    if (!this.editar) {
      this.editar = true;
      this.DNIParaEditar = DNI;
    } else {
      this.editar = false;
      this.DNIParaEditar = undefined;
      this.firestoreSvc.editarTitulo(
        DNI,
        nombre,
        apellido,
        yearDeEgreso
      );
    }
  }

  async cancelarEdicion() {
    this.editar = false;
    this.DNIParaEditar = undefined;
    this.titulos = await this.firestoreSvc.getTitulos();
    this.dataSource = new MatTableDataSource(this.titulos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async eliminarTitulo(DNI) {
    await this.firestoreSvc.eliminarTitulo(DNI);
    let indice: number;
    for (let i = 0; i < this.titulos.length; i++) {
      if (this.titulos[i].DNI == DNI) {
        indice = i;
        break;
      }
    }
    console.log(DNI, indice);
    if (indice > -1) {
      this.titulos.splice(indice, 1);
    }
    this.dataSource = new MatTableDataSource(this.titulos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  abrirFormularioDeTitulo() {
    let dialogRef = this.dialog.open(AgregarTituloComponent);
    dialogRef.afterClosed().subscribe(async () => {
      this.titulos = await this.firestoreSvc.getTitulos();
      this.dataSource = new MatTableDataSource(this.titulos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  dataEgresados() {
    let egresados = this.firestoreSvc.getAllEgresados();
    return egresados;
  }

  dataEmpresas() {
    let empresas = this.firestoreSvc.getAllEmpresas();
    return empresas;
  }

  //

  private setting = {
    element: {
      dynamicDownload: null as HTMLElement,
    },
  };

  downloadJsonEgresados() {
    this.dataEgresados().then((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'Data Egresados.json',
        text: JSON.stringify(res),
      });
    });
  }

  downloadJsonEmpresas() {
    this.dataEmpresas().then((res) => {
      this.dyanmicDownloadByHtmlTag({
        fileName: 'Data Empresas.json',
        text: JSON.stringify(res),
      });
    });
  }

  private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType =
      arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`
    );
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent('click');
    element.dispatchEvent(event);
  }
}
