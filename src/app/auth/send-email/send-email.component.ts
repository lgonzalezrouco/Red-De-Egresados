import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
  providers: [AuthService],
})
export class SendEmailComponent implements OnInit {

  public user$: Observable<any> = this.authSvc.afAuth.user;
  public isVerified: boolean;

  constructor(private authSvc: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authSvc.afAuth.user.subscribe((u) => {
      if (!u) {
        this.router.navigate(['/home']);
      }
    });
  }

  onSendEmail(): void {
    this.authSvc.sendVerificationEmail();
  }

}
