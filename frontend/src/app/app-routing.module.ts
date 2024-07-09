import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MenuComponent } from './components/menu/menu.component';
import { CalificacionComponent } from './components/calificacion/calificacion.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { PedidoComponent } from './components/pedido/pedido.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { 
    path: 'home', 
    component: HomeComponent },
  {
    path:'registro',
     component: RegistroComponent
  },
  {
    path:'login',
    component: LoginComponent
  },
  { 
    path: 'menu', 
    component: MenuComponent },
  { 
    path: 'calificacion',
    component: CalificacionComponent },
  { 
    path: 'pedido', 
    component: PedidoComponent,
    canActivate: [AuthGuard]
 },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
  