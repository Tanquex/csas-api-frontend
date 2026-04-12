import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environments';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http= inject(HttpClient);
  private baseUrl=`${environment.apiUrl}/auth`;
  private router=inject(Router)

  // Signal para manejar el estado del usuario de forma que solo se lea ese cachito donde se use esta var
  currentUser = signal<any | null>(null);
  constructor() { 
    // verificamos si hay un token.
    const token = localStorage.getItem('access_token');
    if (token) {
      this.getUserProfile().subscribe({
        error: () => {
          // Si el token ya no es válido (expiró), limpiamos todo
          this.logout().subscribe();
        }
      });
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/loginn`, credentials).pipe(
      tap(res => {

        
        localStorage.setItem('access_token', res.access_token);
        localStorage.setItem('refresh_token', res.refresh_token);
        this.getUserProfile().subscribe(); // Obtenemos el perfil tras loguear
      })
    );
  }

  getUserProfile() {
    return this.http.get<any>(`${this.baseUrl}/mee`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.clear();
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      })
    );
  }




  }


  


