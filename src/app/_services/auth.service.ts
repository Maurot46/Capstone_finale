import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {}

  get isLoggedIn() {
    return this.loggedIn;
  }
  get isLoggedIn2() {
    return this.loggedIn.getValue();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    ).pipe(
      tap(() => {
        this.loggedIn.next(true);
      })
    );
  }
  checkUsernameAvailability(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(AUTH_API+`users/existsByUsername?username=${username}`);
  }
  checkEmailAvailability(email: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(AUTH_API+`users/existsByEmail?email=${email}`);
  }

  register(username: string, email: string, password: string, name: string, surname: string, address: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
        name,
        surname,
        address
      },
      httpOptions
    );
  }
  registerRestaurateur(username: string, email: string, password: string, name: string, surname: string, address: string, phoneNumber: string, numeroPartitaIva: string, indirizzoRistorante: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signupRestaurateur',
      {
        username,
        email,
        password,
        name,
        surname,
        address,
        phoneNumber,
        numeroPartitaIva,
        indirizzoRistorante
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions).pipe(
      tap(() => {
        this.loggedIn.next(false);
      })
    );
  }
}
