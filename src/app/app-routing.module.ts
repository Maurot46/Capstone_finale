import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { RegisterRestaurateurComponent } from './components/register-restaurateur/register-restaurateur.component';
import { RegisterComponent } from './components/register/register.component';
import { RistorantiComponent } from './components/ristoranti/ristoranti.component';
import { RistoratoreBoardComponent } from './components/ristoratore-board/ristoratore-board.component';
import { LoginComponent } from './login/login.component';
import { ChartComponent } from './components/chart/chart.component';
const routes: Routes = [
  { path:'home', component:HomeComponent},
  { path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'registerRestaurateur', component: RegisterRestaurateurComponent},
  {path: 'ristoratore-board', component: RistoratoreBoardComponent},
  {path: 'ristoranti', component: RistorantiComponent},
  {path: 'chart', component: ChartComponent},
  { path: '', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
