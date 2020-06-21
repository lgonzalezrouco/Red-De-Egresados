import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eleccion-register',
  templateUrl: './eleccion-register.component.html',
  styleUrls: ['./eleccion-register.component.scss']
})
export class EleccionRegisterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goToEgresadoRegister(){
    this.router.navigate(['/register']);
  }

  goToEmpresaRegister(){
    this.router.navigate(['/register-empresa']);
  }

}
