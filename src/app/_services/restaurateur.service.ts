import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Restaurateur } from './restaurateur';

@Injectable({
  providedIn: 'root'
})
export class RestaurateurService {
  private baseUrl = 'http://localhost:8080/api/restaurateur';
  constructor(private http: HttpClient) { }
  getAllRestaurateurs(): Observable<Restaurateur[]> {
    return this.http.get<Restaurateur[]>(`${this.baseUrl}/getAll`);
  }

}
