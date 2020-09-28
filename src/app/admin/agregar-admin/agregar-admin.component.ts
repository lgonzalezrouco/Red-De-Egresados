import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FirestoreService } from 'src/app/shared/services/firestore.service';
import { AgregarTituloComponent } from '../agregar-titulo/agregar-titulo.component';

@Component({
  selector: 'app-agregar-admin',
  templateUrl: './agregar-admin.component.html',
  styleUrls: ['./agregar-admin.component.scss'],
})
export class AgregarAdminComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
    ])
  });

  emailPattern = this.loginForm.get('email');

  constructor(
    private firestoreSvc: FirestoreService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<AgregarTituloComponent>
  ) {}

  ngOnInit(): void {}

  async agregarAdmin() {
    try {
      const { email } = this.loginForm.value;
      if (email == '') {
        throw new Error('El email no fue completados');
      }
      await this.firestoreSvc.agregarAdmin(email);
      this.dialogRef.close();
    } catch (error) {
      console.log(error.message);
    }
  }
}
