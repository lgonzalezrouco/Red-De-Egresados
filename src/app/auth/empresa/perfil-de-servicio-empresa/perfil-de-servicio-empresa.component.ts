import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-perfil-de-servicio-empresa',
  templateUrl: './perfil-de-servicio-empresa.component.html',
  styleUrls: ['./perfil-de-servicio-empresa.component.scss'],
})
export class PerfilDeServicioEmpresaComponent implements OnInit {
  public uid;
  public empresaIngresada;
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
            this.router.navigate(['/perfil-empresa']);
          } else {
            // Sino muestra los datos correspondientes
            this.authSvc.getUser(this.uid).subscribe((userSnapshot) => {
              this.empresaIngresada = userSnapshot.payload.data();
              console.log(userSnapshot.payload.exists);
              console.log(this.empresaIngresada);
            });
          }
        });
      }
    }

    /* this.route.paramMap.subscribe((params) => {
      this.uid = params.get('uid');
      console.log(this.uid);
      this.authSvc.getUser(this.uid).subscribe((userSnapshot) => {
        this.empresaIngresada = userSnapshot.payload.data();
        console.log(userSnapshot.payload.exists);
        console.log(this.empresaIngresada);
      });
    }); */
  }
}
