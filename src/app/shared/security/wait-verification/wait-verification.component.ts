import { AfterViewInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { MiscService } from '../../services/misc.service';

@Component({
  selector: 'app-wait-verification',
  templateUrl: './wait-verification.component.html',
  styleUrls: ['./wait-verification.component.scss'],
})
export class WaitVerificationComponent implements OnInit, AfterViewInit {
  public user$: Observable<any> = this.authSvc.afAuth.user;
  public isVerified: boolean;

  constructor(
    private authSvc: AuthService,
    private miscSvc: MiscService,
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario != 'wait-verification') {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  async ngAfterViewInit() {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario != 'wait-verification') {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  async onSendEmail() {
    await this.authSvc.sendVerificationEmail();
    window.alert('Se envio el email, mire su casilla de mensajes!');
  }
}
