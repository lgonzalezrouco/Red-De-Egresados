import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  public user$: Observable<any> = this.authSvc.afAuth.user;
  public userData;
  public loggedUser: any = '';
  public esEmpresa: boolean = null

  ngOnInit(): void {
    this.userData = this.verificarSiAlguienInicio();
  }

  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authSvc: AuthService, private router: Router
  ) {
    this.matIconRegistry.addSvgIcon(
      `home`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/images/home.svg")
    );
    this.matIconRegistry.addSvgIcon(
      `user`,
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/images/user.svg")
    );
  }

  verificarSiAlguienInicio() {
    try {
      this.authSvc.afAuth.user.subscribe((u) => {
        if (u) {

          this.authSvc.getUser(u.uid).subscribe((userSnapshot) => {

            this.loggedUser = userSnapshot.payload.data();
            console.log(userSnapshot.payload.exists);
            if(this.loggedUser.empresa){
              this.esEmpresa = true;
            } else {
              this.esEmpresa = false;
            }
          })
          return u;
        } else {
          console.log("Nadie inicio sesion");
        }

      })
    } catch (error) {
      console.log(error);
    }
  }

}
