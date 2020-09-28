import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public user;

  constructor(private miscSvc: MiscService, private router: Router) { }

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario != 'nadie') {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}
