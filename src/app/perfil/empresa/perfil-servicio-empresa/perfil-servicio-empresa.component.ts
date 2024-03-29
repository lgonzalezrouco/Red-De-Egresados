import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-perfil-servicio-empresa',
  templateUrl: './perfil-servicio-empresa.component.html',
  styleUrls: ['./perfil-servicio-empresa.component.scss'],
})
export class PerfilServicioEmpresaComponent implements OnInit {
  public uid;
  public empresaIngresada;
  public uidDelUsuarioLogeado;
  public descripcion: string;

  constructor(
    private miscSvc: MiscService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario == 'empresa' || hayUnUsuario == 'egresado') {
      const user = JSON.parse(localStorage.getItem('user'));
      const uid = localStorage.getItem('uid');
      const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
      this.uidDelUsuarioLogeado = localStorage.getItem('uid');
      this.route.paramMap.subscribe(async (params) => {
        this.uid = params.get('uid');
        console.log(this.uid);
        console.log(this.uidDelUsuarioLogeado);
        // Si el usuario seleccionado es el propio, se navega al propio perfil
        if (this.uid == this.uidDelUsuarioLogeado) {
          this.router.navigate(['/home']);
        } else {
          // Sino muestra los datos correspondientes
          this.empresaIngresada = await this.miscSvc.getUser(this.uid);
          this.getDescripcion();
        }
      });
    } else {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  public getDescripcion() {
    this.descripcion = '';
    let inicial = true;
    let descripcionAux: string[] = this.empresaIngresada.descripcion;
    for (const word of descripcionAux) {
      if (inicial) {
        this.descripcion = word;
        inicial = false;
      } else {
        this.descripcion = this.descripcion + ' ' + word;
      }
    }
  }
}
