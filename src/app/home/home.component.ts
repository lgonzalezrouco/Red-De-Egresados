import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public user;

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    if(this.user && uid){
      if (!userFirebase.emailVerified) {
        this.router.navigate(['/wait-verification']);
      } else {
        if(this.user.empresa && uid){
          this.router.navigate(['/home-empresa']);
        } else if(!this.user.empresa && uid) {
          this.router.navigate(['/home-egresado']);
        }
      }
    }
    /* this.authSvc.afAuth.user.subscribe((u) => {
      if (u) {
        this.authSvc.getUser(u.uid).subscribe((userSnapshot) => {
          this.user = userSnapshot.payload.data();
          console.log(userSnapshot.payload.exists);

          if(this.user.empresa){
            this.router.navigate(['/home-empresa']);
          } else {
            this.router.navigate(['/home-egresado']);
          }

        });
      } else {
        console.log('Nadie inicio sesion');
      }
    }); */
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
