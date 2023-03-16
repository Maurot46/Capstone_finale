import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_services/auth.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    name: null,
    surname: null,
    address: null
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
    const { username, email, password, name, surname, address } = this.form;

    this.authService.register(username, email, password, name, surname, address ).subscribe({
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
