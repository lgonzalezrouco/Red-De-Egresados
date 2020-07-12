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
    this.authSvc.afAuth.user.subscribe((u) => {
      if (u) {
        this.authSvc.getUser(u.uid).subscribe((userSnapshot) => {
          this.user = userSnapshot.payload.data();
          console.log(userSnapshot.payload.exists);

          if(this.user.empresa){
            // hacer que vaya al home de la empresa
          } else {
            this.router.navigate(['/home-egresado']);
          }

        });
      } else {
        console.log('Nadie inicio sesion');
      }
    });
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }
}
