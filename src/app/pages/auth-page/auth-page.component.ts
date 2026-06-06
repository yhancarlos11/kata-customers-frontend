import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest, RegisterRequest } from '../../models/api.models';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly registerForm: RegisterRequest = {
    username: '',
    email: '',
    password: ''
  };
  protected readonly loginForm: LoginRequest = {
    username: '',
    password: ''
  };
  protected message = '';

  protected switchMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.message = '';
  }

  protected submitRegister(): void {
    this.message = '';
    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.message = 'Registro exitoso. Ahora ya puedes crear y listar clientes.';
        this.router.navigateByUrl('/customers/create');
      },
      error: (error) => {
        this.message = this.extractError(error, 'No fue posible registrar el usuario.');
      }
    });
  }

  protected submitLogin(): void {
    this.message = '';
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.message = 'Login exitoso.';
        this.router.navigateByUrl('/customers/create');
      },
      error: (error) => {
        this.message = this.extractError(error, 'No fue posible iniciar sesion.');
      }
    });
  }

  private extractError(error: { error?: { message?: string } }, fallback: string): string {
    return error?.error?.message ?? fallback;
  }
}
