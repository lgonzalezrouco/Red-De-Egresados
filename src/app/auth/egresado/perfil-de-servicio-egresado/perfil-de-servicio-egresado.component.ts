import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-de-servicio-egresado',
  templateUrl: './perfil-de-servicio-egresado.component.html',
  styleUrls: ['./perfil-de-servicio-egresado.component.scss']
})
export class PerfilDeServicioEgresadoComponent implements OnInit {

  public uid;
  public usuarioIngresado;

  constructor(private authSvc: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.uid = params.get('uid');
      console.log(this.uid);
      this.authSvc.getUser(this.uid).subscribe((userSnapshot) => {
        this.usuarioIngresado = userSnapshot.payload.data();
        console.log(userSnapshot.payload.exists);
        console.log(this.usuarioIngresado);
      });
    });
  }

}
