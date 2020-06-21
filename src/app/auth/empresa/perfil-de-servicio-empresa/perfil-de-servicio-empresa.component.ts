import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-de-servicio-empresa',
  templateUrl: './perfil-de-servicio-empresa.component.html',
  styleUrls: ['./perfil-de-servicio-empresa.component.scss']
})
export class PerfilDeServicioEmpresaComponent implements OnInit {

  public uid;
  public empresaIngresada;

  constructor(private authSvc: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.uid = params.get('uid');
      console.log(this.uid);
      this.authSvc.getUser(this.uid).subscribe((userSnapshot) => {
        this.empresaIngresada = userSnapshot.payload.data();
        console.log(userSnapshot.payload.exists);
        console.log(this.empresaIngresada);
      });
    });
  }

}
