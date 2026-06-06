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
  protected messageType: 'success' | 'error' = 'success';
  protected isSuccessModalOpen = false;
  protected successModalTitle = '';
  protected successModalMessage = '';
  protected successRedirectUrl = '/customers/create';

  protected switchMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.message = '';
  }

  protected submitRegister(): void {
    this.message = '';
    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.openSuccessModal(
          'Registro exitoso',
          'Te has registrado exitosamente.',
          '/customers/create'
        );
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible registrar el usuario.');
      }
    });
  }

  protected submitLogin(): void {
    this.message = '';
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.openSuccessModal(
          'Inicio de sesion exitoso',
          'Has iniciado sesion exitosamente.',
          '/customers/create'
        );
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible iniciar sesion.');
      }
    });
  }

  protected closeSuccessModal(): void {
    this.isSuccessModalOpen = false;
    this.router.navigateByUrl(this.successRedirectUrl);
  }

  private openSuccessModal(title: string, message: string, redirectUrl: string): void {
    this.successModalTitle = title;
    this.successModalMessage = message;
    this.successRedirectUrl = redirectUrl;
    this.isSuccessModalOpen = true;
  }

  private extractError(error: { error?: { message?: string } }, fallback: string): string {
    return error?.error?.message ?? fallback;
  }
}
