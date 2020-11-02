import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubUser } from 'src/app/shared/interfaces/githubUser';
import { ApisService } from 'src/app/shared/services/apis.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { MiscService } from 'src/app/shared/services/misc.service';
import { EmailContactComponent } from '../email-contact/email-contact.component';

@Component({
  selector: 'app-perfil-servicio-egresado',
  templateUrl: './perfil-servicio-egresado.component.html',
  styleUrls: ['./perfil-servicio-egresado.component.scss'],
})
export class PerfilServicioEgresadoComponent implements OnInit {
  public uid;
  public usuarioIngresado;
  public fechaDeNacimiento;
  public uidDelUsuarioLogeado;
  public capacitaciones;
  public capacitacionesLength: number;
  public social;
  public githubUser: GithubUser;
  public githubRepos;
  public telefono: string;

  constructor(
    private miscSvc: MiscService,
    private apiSvc: ApisService,
    private firestoreSvc: FirestoreService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario == 'egresado' || hayUnUsuario == 'empresa') {
      this.uidDelUsuarioLogeado = localStorage.getItem('uid');
      const user = JSON.parse(localStorage.getItem('user'));
      const uid = localStorage.getItem('uid');
      const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
      this.route.paramMap.subscribe(async (params) => {
        this.uid = params.get('uid');
        console.log(this.uid);
        console.log(this.uidDelUsuarioLogeado);
        // Si el usuario seleccionado es el propio, se navega al propio perfil
        if (this.uid == this.uidDelUsuarioLogeado) {
          this.router.navigate(['/perfil']);
        } else {
          // Sino muestra los datos correspondientes
          this.usuarioIngresado = await this.miscSvc.getUser(this.uid);
          this.social = await this.miscSvc.getUserSocial(this.uid);
          const timestamp = this.usuarioIngresado.birthday.seconds;
          this.fechaDeNacimiento = new Date(timestamp * 1000);
          this.getCapacitaciones();
          await this.getGithubCard();
          this.telefono = '549' + this.usuarioIngresado.cellphone;
        }
      });
    } else {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  async getCapacitaciones() {
    await this.firestoreSvc
      .getCapacitaciones(this.uid)
      .then((capacitaciones) => {
        this.capacitaciones = capacitaciones.capacitaciones;
        this.capacitacionesLength = this.capacitaciones.length;
        let i: number = 0;
        for (const capacitacion of this.capacitaciones) {
          i = i + 1;
        }
      });
  }

  abrirFormularioDeContacto() {
    let nombreDelUsuario: string =
      this.usuarioIngresado.firstName + ' ' + this.usuarioIngresado.lastName;
    let dialogRef = this.dialog.open(EmailContactComponent, {
      data: { name: nombreDelUsuario, email: this.usuarioIngresado.email },
    });
  }

  getGithubRepos() {
    const url = this.githubUser.repos_url;
    return this.http.get<any>(url).toPromise();
  }

  async getGithubCard(){
    this.githubUser = await this.apiSvc.getGithubUser(
      this.social.githubUsername
    );
    this.getGithubRepos().then((result) => {
      this.githubRepos = result;
      this.githubRepos = this.githubRepos.slice(0, 3);
    });
  }

  abrirFormularioDeContactoWhatsapp(){
    window.location.href = 'https://api.whatsapp.com/send?phone=' + this.telefono;
  }
}
