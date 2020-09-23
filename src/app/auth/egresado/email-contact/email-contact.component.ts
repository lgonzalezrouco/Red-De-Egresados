import { Component, OnInit, Inject } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { AuthService } from '../../services/auth.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { keys } from 'config';

@Component({
  selector: 'app-email-contact',
  templateUrl: './email-contact.component.html',
  styleUrls: ['./email-contact.component.scss'],
})
export class EmailContactComponent implements OnInit {
  constructor(
    private authSvc: AuthService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  public user: any;
  public uid: any;
  public userFirebase: any;

  public nombreAContactar: string;
  public emailAContactar: string;

  public result: string = '';

  async ngOnInit(): Promise<void> {
    await this.authSvc.getUserFirebase();
    await this.authSvc.getUserAndUID();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.uid = localStorage.getItem('uid');
    this.userFirebase = JSON.parse(localStorage.getItem('userFirebase'));
    console.log(this.data);
    this.nombreAContactar = this.data.name;
    this.emailAContactar = this.data.email;
    console.log(this.nombreAContactar);
    console.log(this.emailAContactar);
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
        },
        (error) => {
          console.log(error.text);
        }
      );
  }
}
