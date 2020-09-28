import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  public user$: Observable<any> = this.authSvc.afAuth.user;
  public userData;
  public loggedUser: any = '';
  public esEmpresa: boolean = null;

  ngOnInit(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    if (this.loggedUser.empresa && uid) {
      this.esEmpresa = true;
    } else if (!this.loggedUser.empresa && uid) {
      this.esEmpresa = false;
    }
  }

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      `home`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/images/home.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      `user`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/images/user.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      `logout`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/images/logout.svg'
      )
    );
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
