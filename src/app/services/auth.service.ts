import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal(localStorage.getItem('kata.jwt') ?? '');

  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => this.tokenSignal().length > 0);

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'kata.jwt') {
        this.tokenSignal.set(event.newValue ?? '');
      }
    });
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/register', payload)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/login', payload)
      .pipe(tap((response) => this.saveToken(response.token)));
  }

  logout(): void {
    this.tokenSignal.set('');
    localStorage.removeItem('kata.jwt');
  }

  getToken(): string {
    const storedToken = localStorage.getItem('kata.jwt') ?? '';
    if (storedToken !== this.tokenSignal()) {
      this.tokenSignal.set(storedToken);
    }

    return storedToken;
  }

  hasToken(): boolean {
    return this.getToken().length > 0;
  }

  private saveToken(token: string): void {
    this.tokenSignal.set(token);
    localStorage.setItem('kata.jwt', token);
  }
}
