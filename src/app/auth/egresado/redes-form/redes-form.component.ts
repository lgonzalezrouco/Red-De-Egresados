import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/shared/interfaces/user';
import { AuthService } from '../../services/auth.service';

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
    private authSvc: AuthService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<RedesFormComponent>
  ) {}

  ngOnInit(): void {}

  /* onAddUsername() {
    try {

      const { username } = this.redesForm.value;
      if (username == '') {
        throw new Error('El campo esta vacio');
      }
      console.log(username);
      console.log(this.data.uid);
      console.log(this.data.red);
      let url: string;

      if(this.data.red == "Behance") {
        url = "https://www.behance.net/";
      } else if(this.data.red == "Flickr") {
        url = "https://www.flickr.com/photos/"
      } else if(this.data.red == "GitHub") {
        url = "https://github.com/"
      } else if(this.data.red == "Instagram") {
        url = "https://www.instagram.com/"
      }

      if(this.getResultUrl(url, username)){
        console.log(true);
      } else {
        console.log(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  } */

  /* async checkUrl(url: string): Promise<any> {
    return await fetch(url, { mode: 'no-cors' })
      .then((res) => true)
      .catch((err) => false);
  }

  async getResultUrl(url: string, username: any): Promise<any> {
    await this.checkUrl(url + username).then((res) => {
      return res;
    });
  } */

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

      let result = await this.authSvc.agregarGithub(username, this.user);

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
