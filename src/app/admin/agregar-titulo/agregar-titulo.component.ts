import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore.service';

@Component({
  selector: 'app-agregar-titulo',
  templateUrl: './agregar-titulo.component.html',
  styleUrls: ['./agregar-titulo.component.scss']
})
export class AgregarTituloComponent implements OnInit {

  tituloForm = new FormGroup({
    id: new FormControl('', [Validators.required]),
    DNI: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+$'),
    ]),
  });

  idPattern = this.tituloForm.get('id');
  DNIPattern = this.tituloForm.get('DNI');

  constructor(
    private firestoreSvc: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AgregarTituloComponent>
  ) {}

  ngOnInit(): void {}

  async agregarTitulo() {
    try {
      const { id, DNI } = this.tituloForm.value;
      if(id == '' || DNI == '') {
        throw new Error("El id o el DNI no fueron completados");
      }
      await this.firestoreSvc.agregarTitulo(id, DNI);
      this.dialogRef.close();
    } catch(error) {
      console.log(error.message)
    }
  }

}
