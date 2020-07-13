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

  ngOnInit(): void {
    const uid = localStorage.getItem('uid');
    if(!uid) {
      this.router.navigate(['/home']);
    }
  }

  onSendEmail(){
    this.authSvc.sendVerificationEmail();
  }

}
