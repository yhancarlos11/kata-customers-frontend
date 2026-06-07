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
  protected loginErrors: Partial<Record<'username' | 'password', string>> = {};
  protected registerErrors: Partial<Record<'username' | 'email' | 'password', string>> = {};
  protected isSuccessModalOpen = false;
  protected successModalTitle = '';
  protected successModalMessage = '';
  protected successRedirectUrl = '/customers/create';

  protected switchMode(mode: 'login' | 'register'): void {
    this.mode.set(mode);
    this.message = '';
    this.loginErrors = {};
    this.registerErrors = {};
  }

  protected submitRegister(): void {
    this.message = '';
    this.registerErrors = this.validateRegisterForm();
    if (Object.keys(this.registerErrors).length > 0) {
      this.messageType = 'error';
      this.message = 'Corrige los errores del formulario.';
      return;
    }

    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.openSuccessModal(
          'Registro exitoso',
          'Te has registrado exitosamente.',
          '/customers/create'
        );
      },
      error: (error) => {
        this.registerErrors = this.extractValidationErrors(error) as Partial<
          Record<'username' | 'email' | 'password', string>
        >;
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible registrar el usuario.');
      }
    });
  }

  protected submitLogin(): void {
    this.message = '';
    this.loginErrors = this.validateLoginForm();
    if (Object.keys(this.loginErrors).length > 0) {
      this.messageType = 'error';
      this.message = 'Corrige los errores del formulario.';
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.openSuccessModal(
          'Inicio de sesión exitoso',
          'Has iniciado sesión exitosamente.',
          '/customers/create'
        );
      },
      error: (error) => {
        this.loginErrors = this.extractValidationErrors(error) as Partial<
          Record<'username' | 'password', string>
        >;
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible iniciar sesión.');
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

  private validateLoginForm(): Partial<Record<'username' | 'password', string>> {
    const errors: Partial<Record<'username' | 'password', string>> = {};
    if (!this.loginForm.username?.trim()) {
      errors.username = 'El username es obligatorio.';
    }
    if (!this.loginForm.password?.trim()) {
      errors.password = 'La contraseña es obligatoria.';
    }
    return errors;
  }

  private validateRegisterForm(): Partial<Record<'username' | 'email' | 'password', string>> {
    const errors: Partial<Record<'username' | 'email' | 'password', string>> = {};
    if (!this.registerForm.username?.trim()) {
      errors.username = 'El username es obligatorio.';
    }
    if (!this.registerForm.email?.trim()) {
      errors.email = 'El correo es obligatorio.';
    } else if (!this.isValidEmail(this.registerForm.email)) {
      errors.email = 'Debes ingresar un correo electrónico válido.';
    }
    if (!this.registerForm.password?.trim()) {
      errors.password = 'La contraseña es obligatoria.';
    } else if (this.registerForm.password.length < 6) {
      errors.password = 'La contraseña debe tener al menos 6 caracteres.';
    }
    return errors;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private extractValidationErrors(error: { error?: { validationErrors?: Record<string, string> } }): Record<string, string> {
    return error?.error?.validationErrors ?? {};
  }

  private extractError(
    error: { error?: { message?: string; validationErrors?: Record<string, string> } },
    fallback: string
  ): string {
    const validationErrors = error?.error?.validationErrors;
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      return Object.values(validationErrors)[0];
    }
    return error?.error?.message ?? fallback;
  }
}
