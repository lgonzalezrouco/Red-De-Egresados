import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { FirestoreService } from '../shared/services/firestore.service';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.scss'],
})
export class PruebaComponent implements OnInit {
  parameterFormGroup = new FormGroup({
    parameter: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
  });

  public valorDeEvent;
  public startAt = new Subject();
  public endAt = new Subject();
  public startObservable = this.startAt.asObservable();
  public endObservable = this.endAt.asObservable();
  public resultadosDeBusqueda = null;

  constructor(private firestoreSvc: FirestoreService) {}

  ngOnInit(): void {
    this.getResultsWithFirstName();
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
  async makeQueryWithFirstName(start, end) {
    return await this.firestoreSvc.searchWithEveryParameter(start, end);
  }

  getResultsWithFirstName() {
    let subscription = combineLatest(
      this.startObservable,
      this.endObservable
    ).subscribe((value) => {
      if (value[0] != null || value[0] != undefined) {
        this.makeQueryWithFirstName(value[0], value[1]).then((resultado) => {
          this.resultadosDeBusqueda = resultado;
          this.resultadosDeBusqueda.forEach(doc => {
            console.log(doc.data())
          })
          setTimeout(() => {
            subscription.unsubscribe;
            console.log('DESUSCRITO');
          }, 30000);
        });
      } else {
        console.log('No ingreso nada');
      }
    });
  }
}
