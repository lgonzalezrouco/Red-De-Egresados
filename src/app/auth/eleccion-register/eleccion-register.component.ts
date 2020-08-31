import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-eleccion-register',
  templateUrl: './eleccion-register.component.html',
  styleUrls: ['./eleccion-register.component.scss'],
})
export class EleccionRegisterComponent implements OnInit {
  constructor(private router: Router, private authSvc: AuthService) {}

  async ngOnInit(): Promise<void> {
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    console.log(user);
    console.log(uid);
    if (user && uid) {
      if (!userFirebase.emailVerified) {
        this.router.navigate(['/wait-verification']);
      } else {
        if (user.empresa && uid) {
          this.router.navigate(['/perfil-empresa']);
        } else if (!user.empresa && uid) {
          this.router.navigate(['/perfil']);
        }
      }
    }
  }

  goToEgresadoRegister() {
    this.router.navigate(['/register']);
  }

  goToEmpresaRegister() {
    this.router.navigate(['/register-empresa']);
  }
}
