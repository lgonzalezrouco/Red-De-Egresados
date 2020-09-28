import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { GithubUser } from '../interfaces/githubUser';
import { MiscService } from './misc.service';

@Injectable({
  providedIn: 'root',
})
export class ApisService {
  constructor(
    private angularFirestore: AngularFirestore,
    private http: HttpClient,
    private miscSvc: MiscService
  ) {}

  public async agregarGithub(githubUsername, user): Promise<any> {
    try {
      if (!this.checkGithubUser(githubUsername)) {
        console.log('entre');
        return 'El usuario no existe';
      }

      // Se actualizan todos los datos del documento del usuario
      const result = this.angularFirestore
        .collection('social')
        .doc(user.uid)
        .set({
          githubUsername: githubUsername,
        });

      await this.miscSvc.saveUserSocial(user.uid);

      return result;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  }

  public getGithubUser(name: string): Promise<GithubUser> {
    const url = `https://api.github.com/users/${name}`;
    return this.http.get<GithubUser>(url).toPromise();
  }

  public async checkGithubUser(githubUsername: string): Promise<boolean> {
    let mensajeDeError: string;
    await this.getGithubUser(githubUsername).then((result) => {
      mensajeDeError = result.message;
    });
    if (mensajeDeError == 'Not Found') {
      return false;
    } else {
      return true;
    }
  }
}
