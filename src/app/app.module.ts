import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterRestaurateurComponent } from './components/register-restaurateur/register-restaurateur.component';
import { RistoratoreBoardComponent } from './components/ristoratore-board/ristoratore-board.component';
import { RistorantiComponent } from './components/ristoranti/ristoranti.component';
import { ChartComponent } from './components/chart/chart.component';
import { NgcCookieConsentModule, NgcCookieConsentConfig } from 'ngx-cookieconsent';
import { NgxPayPalModule } from 'ngx-paypal';
import { FooterComponent } from './components/footer/footer.component';
import { GuardGuard } from './components/guard.guard';

const cookieConfig:NgcCookieConsentConfig = {
  cookie: {
    domain: 'http://localhost:4200' // or 'your.domain.com' // it is mandatory to set a domain, for cookies to work properly (see https://goo.gl/S2Hy2A)
  },
  position: 'bottom-right',
  palette: {
    popup: {
      background: '#8411e8',
      text: '#000000',
      link: '#ffffff'
    },
    button: {
      background: '#ffffff',
      text: '#000000',
      border: 'transparent'
    }
  },
  theme: 'classic',
  type: 'info'
};
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    HomeComponent,
    RegisterRestaurateurComponent,
    RistoratoreBoardComponent,
    RistorantiComponent,
    ChartComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ReactiveFormsModule,
    NgcCookieConsentModule.forRoot(cookieConfig),
    NgxPayPalModule,
    NgxPaginationModule
  ],
  providers: [httpInterceptorProviders, {
    provide: RECAPTCHA_SETTINGS,
    useValue: {
      siteKey: environment.recaptcha.siteKey,
    } as RecaptchaSettings,
  }, GuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }

