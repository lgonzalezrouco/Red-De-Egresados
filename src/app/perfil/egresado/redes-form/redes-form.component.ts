import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { User } from 'src/app/shared/interfaces/user';
import { ApisService } from 'src/app/shared/services/apis.service';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-redes-form',
  templateUrl: './redes-form.component.html',
  styleUrls: ['./redes-form.component.scss'],
})
export class RedesFormComponent implements OnInit {
  redesForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
  });

  usernamePattern = this.redesForm.get('username');

  red: string = this.data.red;
  user: User = this.data.user;

  constructor(
    private miscSvc: MiscService,
    private apiSvc: ApisService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<RedesFormComponent>
  ) {}

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario != 'egresado' && hayUnUsuario != 'empresa') {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  async onAddUsername() {
    try {
      const { username } = this.redesForm.value;
      if (username == '') {
        throw new Error('El campo esta vacio');
      }

      if (this.data.red == 'GitHub') {
        await this.agregarGithub();
      }

      this.dialogRef.close();
    } catch (error) {
      console.log(error.message);
    }
  }

  async agregarGithub() {
    try {
      const { username } = this.redesForm.value;
      if (username == '') {
        throw new Error('El campo esta vacio');
      }

      let result = await this.apiSvc.agregarGithub(username, this.user);

      if (typeof result.message === 'string') {
        throw new Error('El usuario no existe');
      } else {
        return result;
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
