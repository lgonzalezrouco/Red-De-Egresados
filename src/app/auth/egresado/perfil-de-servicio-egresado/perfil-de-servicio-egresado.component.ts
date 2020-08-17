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
        this.route.paramMap.subscribe((params) => {
          this.uid = params.get('uid');
          console.log(this.uid);
          console.log(this.uidDelUsuarioLogeado);
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

    /* // Se consigue el uid del usuario que esta logeado
    this.authSvc.afAuth.user.subscribe((u) => {
      if (u) {
        this.uidDelUsuarioLogeado = u.uid;
        console.log(this.uidDelUsuarioLogeado);
      } else {
        console.log('Nadie inicio sesion');
      }
      return this.getUsuarioIngresado();
    }); */
  }

  /* // Se consigue el uid del usuario del que se quiere ver el perfil
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
  } */
}
