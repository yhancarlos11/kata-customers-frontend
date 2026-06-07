import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import {
  AuthMeResponse,
  AuthResponse,
  LoginRequest,
  LogoutResponse,
  RefreshTokenRequest,
  RegisterRequest
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenSignal = signal(localStorage.getItem('kata.jwt') ?? '');
  private readonly refreshTokenSignal = signal(localStorage.getItem('kata.rjwt') ?? '');

  readonly token = computed(() => this.tokenSignal());
  readonly isAuthenticated = computed(() => this.tokenSignal().length > 0);

  constructor() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'kata.jwt') {
        this.tokenSignal.set(event.newValue ?? '');
      }

      if (event.key === 'kata.rjwt') {
        this.refreshTokenSignal.set(event.newValue ?? '');
      }
    });
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/register', payload)
      .pipe(tap((response) => this.saveTokens(response.token, response.refreshToken)));
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>('/api/auth/login', payload)
      .pipe(tap((response) => this.saveTokens(response.token, response.refreshToken)));
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    const payload: RefreshTokenRequest = { refreshToken };

    return this.http
      .post<AuthResponse>('/api/auth/refresh', payload)
      .pipe(tap((response) => this.saveTokens(response.token, response.refreshToken)));
  }

  me(): Observable<AuthMeResponse> {
    return this.http.get<AuthMeResponse>('/api/auth/me');
  }

  logout(): Observable<LogoutResponse> {
    if (!this.hasToken()) {
      this.clearSession();
      return of({ message: 'Sesión cerrada correctamente' });
    }

    const refreshToken = this.getRefreshToken();

    return this.http
      .post<LogoutResponse>('/api/auth/logout', { refreshToken })
      .pipe(tap(() => this.clearSession()));
  }

  clearSession(): void {
    this.tokenSignal.set('');
    this.refreshTokenSignal.set('');
    localStorage.removeItem('kata.jwt');
    localStorage.removeItem('kata.rjwt');
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

  getRefreshToken(): string {
    const storedRefreshToken = localStorage.getItem('kata.rjwt') ?? '';
    if (storedRefreshToken !== this.refreshTokenSignal()) {
      this.refreshTokenSignal.set(storedRefreshToken);
    }

    return storedRefreshToken;
  }

  hasRefreshToken(): boolean {
    return this.getRefreshToken().length > 0;
  }

  private saveTokens(token: string, refreshToken: string): void {
    this.tokenSignal.set(token);
    this.refreshTokenSignal.set(refreshToken);
    localStorage.setItem('kata.jwt', token);
    localStorage.setItem('kata.rjwt', refreshToken);
  }
}
