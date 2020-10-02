import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { MiscService } from 'src/app/shared/services/misc.service';

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

  public user: any;
  public userFirebase: any;
  public uid: any;

  constructor(
    private http: HttpClient,
    private authSvc: AuthService,
    private miscSvc: MiscService,
    private firestoreSvc: FirestoreService
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario == 'empresa') {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
      this.uid = localStorage.getItem('uid');
      this.profesions = this.http.get('../../../../assets/JSON/profesion.json');
      this.getResultsWithFirstName();
    } else {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
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
    return this.firestoreSvc.searchwithFirstName(start, end);
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
    return this.firestoreSvc.searchWithOption(
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
    console.log(fecha);
    const timestamp = fecha.seconds;
    let fechaDeNacimiento = new Date(timestamp * 1000);

    let today: Date = new Date();

    let edad: number = today.getFullYear() - fechaDeNacimiento.getFullYear();
    return edad;
  }
}