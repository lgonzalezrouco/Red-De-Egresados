import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
  selector: 'app-agregar-titulo',
  templateUrl: './agregar-titulo.component.html',
  styleUrls: ['./agregar-titulo.component.scss'],
})
export class AgregarTituloComponent implements OnInit {
  tituloForm = new FormGroup({
    DNI: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.pattern('[a-zA-Z ]*'),
      Validators.minLength(2),
    ]),
    yearDeEgreso: new FormControl('', [Validators.required]),
  });

  DNIPattern = this.tituloForm.get('DNI');
  nombrePattern = this.tituloForm.get('nombre');
  apellidoPattern = this.tituloForm.get('apellido');
  egresoPattern = this.tituloForm.get('yearDeEgreso');

  yearsDeEgreso;

  mensaje: string;

  constructor(
    private firestoreSvc: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AgregarTituloComponent>,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.yearsDeEgreso = this.http.get('../../../assets/JSON/egresoYear.json');
  }

  async agregarTitulo() {
    try {
      const {
        DNI,
        nombre,
        apellido,
        yearDeEgreso,
      } = this.tituloForm.value;
      if (
        DNI == '' ||
        nombre == '' ||
        apellido == '' ||
        yearDeEgreso == ''
      ) {
        throw new Error('Algunos de los campos no fueron completados');
      }
      this.mensaje = await this.firestoreSvc.agregarTitulo(
        DNI,
        nombre,
        apellido,
        yearDeEgreso
      );
      if(this.mensaje = "OK") {
        this.dialogRef.close();
      }
    } catch (error) {
      this.mensaje = error.message;
    }
  }
}
