import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wait-verification',
  templateUrl: './wait-verification.component.html',
  styleUrls: ['./wait-verification.component.scss']
})
export class WaitVerificationComponent implements OnInit {

  public user$: Observable<any> = this.authSvc.afAuth.user;
  public isVerified: boolean;

  constructor(private authSvc: AuthService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    const uid = localStorage.getItem('uid');
    const userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user);
    if(!uid) {
      this.router.navigate(['/home']);
    }

    if(userFirebase.emailVerified) {
      if(!user.empresa) {
        this.router.navigate(['/home-egresado']);
      } else {
        this.router.navigate(['/home-empresa']);
      }
    }

  }

  onSendEmail(){
    this.authSvc.sendVerificationEmail();
  }

}
