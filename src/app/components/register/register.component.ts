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
  isSignUpFailed = false;
  errorMessage = '';
  isUsernameAvailable = false;
  formSubmitted = false;
  usernameErrorMessage!: string;

  constructor(private authService : AuthService, private httpClient: HttpClient) { }

  ngOnInit(): void {
  }
  onUsernameBlur(): void {
    if (!this.form.username) {
      return;
    }

    this.authService.checkUsernameAvailability(this.form.username).subscribe({
      next: (result) => {
        this.isUsernameAvailable = result.available;
        if (!this.isUsernameAvailable) {
          this.usernameErrorMessage = 'This username is already taken.';
        } else {
          this.usernameErrorMessage = '';
        }
        console.log('isUsernameAvailable:', this.isUsernameAvailable);
        console.log('usernameErrorMessage:', this.usernameErrorMessage);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onUsernameFocus(): void {
    if (!this.isUsernameAvailable) {
      // If the username is not available, set isUsernameAvailable to true
      // to hide the error message when the input field gains focus again
      this.isUsernameAvailable = true;
      this.usernameErrorMessage = '';
    }
  }

  onSubmit(): void {
    this.formSubmitted = true;
    const { username, email, password, name, surname, address } = this.form;

    this.authService.register(username, email, password, name, surname, address ).subscribe({
      next: data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    });
  }

}
