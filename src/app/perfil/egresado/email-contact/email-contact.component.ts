import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { keys } from 'config';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MiscService } from 'src/app/shared/services/misc.service';

@Component({
  selector: 'app-email-contact',
  templateUrl: './email-contact.component.html',
  styleUrls: ['./email-contact.component.scss'],
})
export class EmailContactComponent implements OnInit {
  constructor(
    private authSvc: AuthService,
    private miscSvc: MiscService,
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<EmailContactComponent>
  ) {}

  public user: any;
  public uid: any;
  public userFirebase: any;

  public nombreAContactar: string;
  public emailAContactar: string;

  public result: string = '';

  async ngOnInit(): Promise<void> {
    let hayUnUsuario: string = await this.miscSvc.checkIfUserIsLogged();
    if (hayUnUsuario == 'egresado' || hayUnUsuario == 'empresa') {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.uid = localStorage.getItem('uid');
      this.userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
      this.nombreAContactar = this.data.name;
      this.emailAContactar = this.data.email;
    } else {
      this.miscSvc.notAllowed(hayUnUsuario);
    }
  }

  sendEmail(e: Event) {
    e.preventDefault();
    emailjs
      .sendForm(
        keys.serviceID,
        keys.templateID,
        e.target as HTMLFormElement,
        keys.userID
      )
      .then(
        (result: EmailJSResponseStatus) => {
          this.result = result.text;
          console.log(result.text);
          this.dialogRef.close();
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
}
