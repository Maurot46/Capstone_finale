import { Component } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-restaurateur',
  templateUrl: './register-restaurateur.component.html',
  styleUrls: ['./register-restaurateur.component.scss']
})
export class RegisterRestaurateurComponent {
  form: any = {
    username: null,
    email: null,
    password: null,
    name: null,
    surname: null,
    address: null,
    indirizzoRistorante: null,
    phoneNumber: null,
    numeroPartitaIva: null,
  };
  isSuccessful = false;
  isUsernameAvailable: boolean = false;
  isEmailAvailable: boolean = false;
  isSignUpFailed = false;
  errorMessage = '';
  formSubmitted = false;
  usernameErrorMessage!: string | null;
  emailErrorMessage!: string | null;
  token: string|undefined;

  constructor(private authService : AuthService, private httpClient: HttpClient) {
    this.token = undefined;
  }

  ngOnInit(): void {
  }

  onUsernameBlur(): void {
    if (!this.form.username) {
      return;
    }

    this.authService.checkUsernameAvailability(this.form.username).subscribe({
      next: (result) => {
        this.isUsernameAvailable = !result.exists;
        if (!this.isUsernameAvailable) {
          this.usernameErrorMessage = 'This username is already taken.';
        } else {
          this.usernameErrorMessage = null;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onUsernameFocus(): void {
    this.usernameErrorMessage = null;
  }

  onEmailBlur(): void {
    if (!this.form.email) {
      return;
    }

    this.authService.checkEmailAvailability(this.form.email).subscribe({
      next: (result) => {
        this.isEmailAvailable = !result.exists;
        if (!this.isEmailAvailable) {
          this.emailErrorMessage = 'This email is already used.';
        } else {
          this.emailErrorMessage = null;
        }
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onEmailFocus(): void {
    this.emailErrorMessage = null;
  }

  onSubmit(): void {
    this.formSubmitted = true;
    const { username, email, password, name, surname, address, indirizzoRistorante, phoneNumber, numeroPartitaIva } = this.form;

    this.authService.registerRestaurateur(username, email, password, name, surname, address, numeroPartitaIva, phoneNumber, indirizzoRistorante).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        console.debug(`Token [${this.token}] generated`);
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }
}
