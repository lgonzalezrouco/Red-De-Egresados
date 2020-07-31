import { Component, OnInit } from '@angular/core';
import { Subject, combineLatest } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-empresa',
  templateUrl: './home-empresa.component.html',
  styleUrls: ['./home-empresa.component.scss'],
})
export class HomeEmpresaComponent implements OnInit {
  public profesions;

  startAt = new Subject();
  endAt = new Subject();
  startObservable = this.startAt.asObservable();
  endObservable = this.endAt.asObservable();
  public resultadosDeBusqueda = null;
  valorDeEvent;

  firstNameFormGroup = new FormGroup({
    firstName: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
  });

  optionsFormGroup = new FormGroup({
    profesion: new FormControl('', [Validators.required]),
    minAge: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    maxAge: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    orientacion: new FormControl('', [Validators.required]),
  });

  constructor(
    private http: HttpClient,
    private authSvc: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user'));
    const uid = localStorage.getItem('uid');
    console.log(user);
    console.log(uid);
    if (!uid) {
      this.router.navigate(['/home']);
    } else if (user && uid) {
      if (!user.empresa && uid) {
        this.router.navigate(['/home-egresado']);
      } else if (user.empresa && uid) {
        this.profesions = this.http.get(
          '../../../../assets/JSON/profesion.json'
        );
        this.getResultsWithFirstName();
        /* this.getResultsWithOptions(); */
      }
    }
    /* if (user && uid) {
      if (user.empresa && uid) {
        this.router.navigate(['/perfil-empresa']);
      } else if (!user.empresa && uid) {
        this.router.navigate(['/perfil']);
      }
    }
    const uid = localStorage.getItem('uid');
    console.log(uid);
    if (!uid) {
      this.router.navigate(['/home']);
    } else {
      this.profesions = this.http.get('../../../../assets/JSON/profesion.json');
      this.getResultsWithFirstName();
      /* this.getResultsWithOptions();
    } */
    /* console.log(this.resultadosDeBusqueda);
    this.authSvc.afAuth.user.subscribe((u) => {
      console.log(u);
      if (!u) {
        this.router.navigate(['/home']);
      } else {
        this.profesions = this.http.get(
          '../../../../assets/JSON/profesion.json'
        );
        this.getResultsWithFirstName();
        /* this.getResultsWithOptions();
      }
    }); */
  }

  // Es para conseguir la informacion para el parametro de busqueda
  getSearchData($event) {
    this.valorDeEvent = $event.target.value;
  }

  searchWithFirstName() {
    this.startAt.next(this.valorDeEvent);
    this.endAt.next(this.valorDeEvent + '\uf8ff');
  }

  // Llama al metodo que se encuentra en el service
  makeQueryWithFirstName(start, end) {
    console.log(start);
    return this.authSvc.searchwithFirstName(start, end);
  }

  /*
   * Se subscribe a un observable que va trayendo la informacion de la busqueda.
   * Por razones de seguiridad y para evitar un consumo de la red, se desuscribe despues de 30 segundos
   */
  getResultsWithFirstName() {
    let subscription = combineLatest(
      this.startObservable,
      this.endObservable
    ).subscribe((value) => {
      if (value[0] != null || value[0] != undefined) {
        this.makeQueryWithFirstName(value[0], value[1]).subscribe(
          (resultado) => {
            this.resultadosDeBusqueda = resultado;
            console.log(this.resultadosDeBusqueda);
            setTimeout(() => {
              subscription.unsubscribe;
              console.log('DESUSCRITO');
            }, 30000);
          }
        );
      } else {
        console.log('No ingreso nada');
      }
    });
  }

  makeQueryWithOptions(profesion, minAge, maxAge, orientacion) {
    return this.authSvc.searchWithOption(
      profesion,
      minAge,
      maxAge,
      orientacion
    );
  }

  getResultsWithOptions() {
    const {
      profesion,
      minAge,
      maxAge,
      orientacion,
    } = this.optionsFormGroup.value;
    if (profesion == '' || minAge == '' || maxAge == '' || orientacion == '') {
      console.log('No lleno todos los campos');
    } else {
      this.makeQueryWithOptions(
        profesion,
        minAge,
        maxAge,
        orientacion
      ).subscribe((resultado) => {
        this.resultadosDeBusqueda = resultado;
        console.log(this.resultadosDeBusqueda);
      });
    }
  }

  getEdad(fecha): number {
    const timeStamp = fecha.toString();
    let [, res] = timeStamp.match(/seconds=(\d+)/);
    let fechaDeNacimiento = new Date(+res * 1000);

    let today: Date = new Date();

    let edad: number = today.getFullYear() - fechaDeNacimiento.getFullYear();
    return edad;
  }
}