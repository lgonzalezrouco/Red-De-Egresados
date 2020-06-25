import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';

import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

import { SendEmailComponent } from './auth/send-email/send-email.component';

import { AngularFireStorageModule } from '@angular/fire/storage';
import { SearchbarComponent } from './shared/searchbar/searchbar.component';
import { EleccionRegisterComponent } from './auth/eleccion-register/eleccion-register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WaitVerificationComponent } from './auth/wait-verification/wait-verification.component';
import { LoginComponent } from './auth/egresado/login/login.component';
import { PerfilComponent } from './auth/egresado/perfil/perfil.component';
import { PerfilDeServicioEgresadoComponent } from './auth/egresado/perfil-de-servicio-egresado/perfil-de-servicio-egresado.component';
import { RegisterComponent } from './auth/egresado/register/register.component';
import { PerfilDeServicioEmpresaComponent } from './auth/empresa/perfil-de-servicio-empresa/perfil-de-servicio-empresa.component';
import { PerfilEmpresaComponent } from './auth/empresa/perfil-empresa/perfil-empresa.component';
import { RegisterEmpresaComponent } from './auth/empresa/register-empresa/register-empresa.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { HomeComponent } from './home/home.component';

import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SendEmailComponent,
    SearchbarComponent,
    EleccionRegisterComponent,
    WaitVerificationComponent,
    LoginComponent,
    PerfilComponent,
    PerfilDeServicioEgresadoComponent,
    RegisterComponent,
    PerfilDeServicioEmpresaComponent,
    PerfilEmpresaComponent,
    RegisterEmpresaComponent,
    ForgotPasswordComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence(),
    FormsModule,
    AngularFireStorageModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
