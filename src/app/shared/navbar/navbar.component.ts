import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [AuthService],
})
export class NavbarComponent implements OnInit {
  public user$: Observable<any> = this.authSvc.afAuth.user;
  public userData;
  public loggedUser: any = '';

  constructor(private authSvc: AuthService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.userData = this.verificarSiAlguienInicio();
  }

  verificarSiAlguienInicio() {
    try {
      this.authSvc.afAuth.user.subscribe((u) => {
        if (u) {
          this.loggedUser = this.authSvc.getUser(u.uid);
          /* this.authSvc.getUser(u.uid).subscribe((userSnapshot) => {
            this.loggedUser = userSnapshot.payload.data();
            console.log(userSnapshot.payload.exists);
            console.log(
              this.loggedUser.firstName +
                ' ' +
                this.loggedUser.lastName +
                ' inició sesion'
            );
            console.log(this.loggedUser.empresa);
          }); */
          return u;
        } else {
          console.log('Nadie inicio sesion');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async onLogout() {
    try {
      await this.authSvc.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.log(error);
    }
  }
}
