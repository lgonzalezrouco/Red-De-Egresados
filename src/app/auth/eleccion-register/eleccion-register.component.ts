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
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid')
    console.log(user);
    console.log(uid);
    if(user && uid){
      if(user.empresa && uid){
        this.router.navigate(['/perfil-empresa']);
      } else if(!user.empresa && uid) {
        console.log("ACA")
        this.router.navigate(['/perfil']);
      }
    }
  }

  goToEgresadoRegister(){
    this.router.navigate(['/register']);
  }

  goToEmpresaRegister(){
    this.router.navigate(['/register-empresa']);
  }

}
