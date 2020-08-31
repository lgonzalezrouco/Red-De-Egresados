import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-de-servicio-egresado',
  templateUrl: './perfil-de-servicio-egresado.component.html',
  styleUrls: ['./perfil-de-servicio-egresado.component.scss'],
})
export class PerfilDeServicioEgresadoComponent implements OnInit {
  public uid;
  public usuarioIngresado;
  public fechaDeNacimiento;
  public uidDelUsuarioLogeado;
  public capacitaciones;
  public capacitacionesLength: number;


  constructor(
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    console.log(user);
    console.log(uid);
    if (!uid) {
      this.router.navigate(['/home']);
    } else if (user && uid) {
      if (!userFirebase.emailVerified) {
        this.router.navigate(['/wait-verification']);
      } else {
        this.uidDelUsuarioLogeado = localStorage.getItem('uid');
        this.route.paramMap.subscribe(async (params) => {
          this.uid = params.get('uid');
          console.log(this.uid);
          console.log(this.uidDelUsuarioLogeado);
          // Si el usuario seleccionado es el propio, se navega al propio perfil
          if (this.uid == this.uidDelUsuarioLogeado) {
            this.router.navigate(['/perfil']);
          } else {
            // Sino muestra los datos correspondientes
            this.usuarioIngresado = await this.authSvc.getUser(this.uid);
            const timeStamp = this.usuarioIngresado.birthday.toString();
            let [, res] = timeStamp.match(/seconds=(\d+)/);
            this.fechaDeNacimiento = new Date(+res * 1000);
            console.log(this.fechaDeNacimiento);
            this.getCapacitaciones();
          }
        });
      }
    }
  }

  async getCapacitaciones() {
    /* let refCapacitaciones = this.authSvc.getCapacitaciones(this.uid); */
    await this.authSvc.getCapacitaciones(this.uid).then((capacitaciones) => {
      /* console.log(ref.capacitaciones);
      localStorage.setItem('capacitaciones', ref.capacitaciones);
      let aux = localStorage.getItem('capacitaciones') */
      this.capacitaciones = capacitaciones.capacitaciones;
      this.capacitacionesLength = this.capacitaciones.length;
      let i : number = 0
      for (const capacitacion of this.capacitaciones) {
        console.log(i);
        i = i + 1;
        console.log(capacitacion);
      }
    });
  }
}
