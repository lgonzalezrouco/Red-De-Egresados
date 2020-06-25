import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@app/auth/services/auth.service';

@Component({
  selector: 'app-wait-verification',
  templateUrl: './wait-verification.component.html',
  styleUrls: ['./wait-verification.component.scss']
})
export class WaitVerificationComponent implements OnInit {

  public user$: Observable<any> = this.authSvc.afAuth.user;
  public isVerified: boolean;

  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
  }

  onSendEmail(){
    this.authSvc.sendVerificationEmail();
  }

}
