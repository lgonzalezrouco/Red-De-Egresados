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

  constructor(
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Se consigue el uid del usuario que esta logeado
    this.authSvc.afAuth.user.subscribe((u) => {
      if (u) {
        this.uidDelUsuarioLogeado = u.uid;
        console.log(this.uidDelUsuarioLogeado);
      } else {
        console.log('Nadie inicio sesion');
      }
      return this.getUsuarioIngresado();
    });
  }

  // Se consigue el uid del usuario del que se quiere ver el perfil
  getUsuarioIngresado(){
    this.route.paramMap.subscribe((params) => {
      this.uid = params.get('uid');
      console.log(this.uid);
      console.log(this.uidDelUsuarioLogeado);
      this.authSvc.afAuth.user.subscribe((u) => {
        if (u) {
          this.uidDelUsuarioLogeado = u.uid;
        } else {
          console.log('Nadie inicio sesion');
        }
      });
      // Si el usuario seleccionado es el propio, se navega al propio perfil
      if (this.uid == this.uidDelUsuarioLogeado) {
        this.router.navigate(['/perfil']);
      } else {
        // Sino muestra los datos correspondientes
        this.authSvc.getUser(this.uid).subscribe((userSnapshot) => {
          this.usuarioIngresado = userSnapshot.payload.data();
          console.log(userSnapshot.payload.exists);
          console.log(this.usuarioIngresado);

          const timeStamp = this.usuarioIngresado.birthday.toString();
          let [, res] = timeStamp.match(/seconds=(\d+)/);
          this.fechaDeNacimiento = new Date(+res * 1000);
          console.log(this.fechaDeNacimiento);
        });
      }
    });
  }
}
