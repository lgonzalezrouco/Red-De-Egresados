import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { EgresadoRegisterComponent } from './auth/egresado/egresado-register/egresado-register.component';
import { EleccionRegisterComponent } from './auth/eleccion-register/eleccion-register.component';
import { EmpresaRegisterComponent } from './auth/empresa/empresa-register/empresa-register.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeEgresadoComponent } from './home/home-egresado/home-egresado.component';
import { HomeEmpresaComponent } from './home/home-empresa/home-empresa.component';
import { LandingPageComponent } from './home/landing-page/landing-page.component';
import { AgregarExperienciasComponent } from './perfil/egresado/agregar-experiencias/agregar-experiencias.component';
import { PerfilEgresadoComponent } from './perfil/egresado/perfil-egresado/perfil-egresado.component';
import { PerfilServicioEgresadoComponent } from './perfil/egresado/perfil-servicio-egresado/perfil-servicio-egresado.component';
import { PerfilEmpresaComponent } from './perfil/empresa/perfil-empresa/perfil-empresa.component';
import { PerfilServicioEmpresaComponent } from './perfil/empresa/perfil-servicio-empresa/perfil-servicio-empresa.component';
import { ForgotPasswordComponent } from './shared/security/forgot-password/forgot-password.component';
import { WaitVerificationComponent } from './shared/security/wait-verification/wait-verification.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: LandingPageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: EgresadoRegisterComponent,
  },
  {
    path: 'register-empresa',
    component: EmpresaRegisterComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'perfil',
    component: PerfilEgresadoComponent,
  },
  {
    path: 'perfil-empresa',
    component: PerfilEmpresaComponent,
  },
  {
    path: 'eleccion-register',
    component: EleccionRegisterComponent,
  },
  {
    path: 'wait-verification',
    component: WaitVerificationComponent,
  },
  {
    path: 'perfil-de-servicio-egresado/:uid',
    component: PerfilServicioEgresadoComponent,
  },
  {
    path: 'perfil-de-servicio-empresa/:uid',
    component: PerfilServicioEmpresaComponent,
  },
  {
    path: 'home-egresado',
    component: HomeEgresadoComponent,
  },
  {
    path: 'home-empresa',
    component: HomeEmpresaComponent,
  },
  {
    path: 'agregar-experiencias',
    component: AgregarExperienciasComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
