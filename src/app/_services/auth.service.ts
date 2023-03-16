import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
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

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }
}
