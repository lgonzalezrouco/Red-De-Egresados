import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendEmailComponent } from './auth/send-email/send-email.component';
import { EleccionRegisterComponent } from './auth/eleccion-register/eleccion-register.component';
import { WaitVerificationComponent } from './auth/wait-verification/wait-verification.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/egresado/login/login.component';
import { RegisterComponent } from './auth/egresado/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { PerfilComponent } from './auth/egresado/perfil/perfil.component';
import { RegisterEmpresaComponent } from './auth/empresa/register-empresa/register-empresa.component';
import { PerfilEmpresaComponent } from './auth/empresa/perfil-empresa/perfil-empresa.component';
import { PerfilDeServicioEgresadoComponent } from './auth/egresado/perfil-de-servicio-egresado/perfil-de-servicio-egresado.component';
import { PerfilDeServicioEmpresaComponent } from './auth/empresa/perfil-de-servicio-empresa/perfil-de-servicio-empresa.component';
import { PruebaComponent } from './prueba/prueba.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'verification-email',
    component: SendEmailComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'perfil',
    component: PerfilComponent,
  },
  {
    path: 'eleccion-register',
    component: EleccionRegisterComponent,
  },
  {
    path: 'register-empresa',
    component: RegisterEmpresaComponent,
  },
  {
    path: 'wait-verification',
    component: WaitVerificationComponent,
  },
  {
    path: 'perfil-empresa',
    component: PerfilEmpresaComponent,
  },
  {
    path: 'perfil-de-servicio-egresado/:uid',
    component: PerfilDeServicioEgresadoComponent,
  },
  {
    path: 'perfil-de-servicio-empresa/:uid',
    component: PerfilDeServicioEmpresaComponent,
  },
  {
    path: 'prueba',
    component: PruebaComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
