import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { MatDialog } from '@angular/material/dialog';
import { EmailContactComponent } from '../email-contact/email-contact.component';
import { GithubUser } from 'src/app/shared/interfaces/githubUser';
import { HttpClient } from '@angular/common/http';

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
  public social;
  public githubUser: GithubUser;
  public githubRepos;

  constructor(
    private authSvc: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public http: HttpClient,
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
            this.social = await this.authSvc.getUserSocial(this.uid)
            const timestamp = this.usuarioIngresado.birthday.seconds;
            this.fechaDeNacimiento = new Date(timestamp * 1000);
            console.log(this.fechaDeNacimiento);
            this.getCapacitaciones();
            this.githubUser = await this.authSvc.getGithubUser(
              this.social.githubUsername
            );
            this.getGithubRepos().then((result) => {
              this.githubRepos = result;
              this.githubRepos = this.githubRepos.slice(0, 3);
            });
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
      let i: number = 0;
      for (const capacitacion of this.capacitaciones) {
        console.log(i);
        i = i + 1;
        console.log(capacitacion);
      }
    });
  }

  abrirFormularioDeContacto() {
    let nombreDelUsuario: string = this.usuarioIngresado.firstName + ' ' + this.usuarioIngresado.lastName
    this.dialog.open(EmailContactComponent, {
      data: {name: nombreDelUsuario, email: this.usuarioIngresado.email}
    });
  }

  getGithubRepos() {
    const url = this.githubUser.repos_url;
    return this.http.get<any>(url).toPromise();
  }
}
