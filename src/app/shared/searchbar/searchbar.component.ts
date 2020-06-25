import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject, combineLatest } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
  providers: [AuthService]
})
export class SearchbarComponent implements OnInit {

  /* searchForm = new FormGroup({
    searchFilter: new FormControl(''),
  }); */


  startAt = new Subject();
  endAt = new Subject();
  startObservable = this.startAt.asObservable();
  endObservable = this.endAt.asObservable();
  resultadosDeBusqueda;
  valorDeEvent;
  searchFilter: string = "firstName";


  constructor(private authSvc: AuthService) { }

  ngOnInit(): void {
    this.getResults();
  }

  // Es para conseguir la informacion para el parametro de busqueda
  getSearchData($event) {
    this.valorDeEvent = $event.target.value;
  }

  onSearch() {
    this.startAt.next(this.valorDeEvent);
    this.endAt.next(this.valorDeEvent + "\uf8ff");
  }

  // Llama al metodo que se encuentra en el service
  makeQuery(start, end, filter) {
    return this.authSvc.search(start, end, filter);
  }

  // Es para setear el filtro para la busqueda
  setFilter(value){
    this.searchFilter = value;
  }

  // Es para conseguir el filtro para la busqueda
  /* getFilter() {
    let { searchFilter } = this.searchForm.value;
    return searchFilter;
  } */

  /*
   * Se subscribe a un observable que va trayendo la informacion de la busqueda.
   * Por razones de seguiridad y para evitar un consumo de la red, se desuscribe despues de 30 segundos
   */
  getResults() {
    let subscription = combineLatest(this.startObservable, this.endObservable).subscribe((value) => {
      this.makeQuery(value[0], value[1], this.searchFilter).subscribe((resultado) => {
        this.resultadosDeBusqueda = resultado;
        console.log(this.resultadosDeBusqueda);
        setTimeout(() => {
          subscription.unsubscribe
          console.log("DESUSCRITO");
        }, 30000)
      })
    })
  }

}
