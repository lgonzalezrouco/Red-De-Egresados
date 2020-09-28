import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-eleccion-register',
  templateUrl: './eleccion-register.component.html',
  styleUrls: ['./eleccion-register.component.scss'],
})
export class EleccionRegisterComponent implements OnInit {
  constructor(
    private router: Router,
    private miscSvc: MiscService
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario != 'nadie') {
      await this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  goToEgresadoRegister() {
    this.router.navigate(['/register']);
  }

  goToEmpresaRegister() {
    this.router.navigate(['/register-empresa']);
  }
}
