import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { EmpresaRegisterComponent } from './auth/empresa/empresa-register/empresa-register.component';
import { EgresadoRegisterComponent } from './auth/egresado/egresado-register/egresado-register.component';
import { LoginComponent } from './auth/login/login.component';
import { EleccionRegisterComponent } from './auth/eleccion-register/eleccion-register.component';
import { PerfilEmpresaComponent } from './perfil/empresa/perfil-empresa/perfil-empresa.component';
import { PerfilServicioEmpresaComponent } from './perfil/empresa/perfil-servicio-empresa/perfil-servicio-empresa.component';
import { PerfilEgresadoComponent } from './perfil/egresado/perfil-egresado/perfil-egresado.component';
import { PerfilServicioEgresadoComponent } from './perfil/egresado/perfil-servicio-egresado/perfil-servicio-egresado.component';
import { ForgotPasswordComponent } from './shared/security/forgot-password/forgot-password.component';
import { WaitVerificationComponent } from './shared/security/wait-verification/wait-verification.component';
import { HomeEgresadoComponent } from './home/home-egresado/home-egresado.component';
import { HomeEmpresaComponent } from './home/home-empresa/home-empresa.component';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { AgregarExperienciasComponent } from './perfil/egresado/agregar-experiencias/agregar-experiencias.component';
import { EmailContactComponent } from './perfil/egresado/email-contact/email-contact.component';
import { RedesFormComponent } from './perfil/egresado/redes-form/redes-form.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { AgregarTituloComponent } from './admin/agregar-titulo/agregar-titulo.component';
import { AgregarAdminComponent } from './admin/agregar-admin/agregar-admin.component';

@NgModule({
  declarations: [
    AppComponent,
    EmpresaRegisterComponent,
    EgresadoRegisterComponent,
    LoginComponent,
    EleccionRegisterComponent,
    PerfilEmpresaComponent,
    PerfilServicioEmpresaComponent,
    PerfilEgresadoComponent,
    PerfilServicioEgresadoComponent,
    ForgotPasswordComponent,
    WaitVerificationComponent,
    HomeEgresadoComponent,
    HomeEmpresaComponent,
    LandingPageComponent,
    AgregarExperienciasComponent,
    EmailContactComponent,
    RedesFormComponent,
    ToolbarComponent,
    DashboardComponent,
    AgregarTituloComponent,
    AgregarAdminComponent,
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
    MatSelectModule,
    MatStepperModule,
    MatToolbarModule,
    HttpClientModule,
    MatDividerModule,
    MatDialogModule,
    MatPaginatorModule,
  ],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule,
  ],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
