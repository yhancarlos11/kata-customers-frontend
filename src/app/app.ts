import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { EnvironmentInfo } from './models/api.models';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly appName = environment.appName;
  protected readonly frontendProfile = environment.profile;
  protected readonly frontendMessage = environment.logMessage;

  protected environmentInfo: EnvironmentInfo | null = null;

  protected readonly isAuthenticated = this.authService.isAuthenticated;

  protected get runtimeProfile(): string {
    return this.environmentInfo?.activeProfile ?? this.frontendProfile;
  }

  ngOnInit(): void {
    this.logFrontendEnvironment();
    this.loadEnvironmentInfo();
    this.validateSession();
  }

  protected logout(): void {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout()
    });
  }

  private finishLogout(): void {
    this.authService.clearSession();
    this.router.navigateByUrl('/auth');
  }

  private validateSession(): void {
    if (!this.authService.hasToken()) {
      return;
    }

    this.authService.me().subscribe({
      next: () => {
        // Session is valid, no action needed.
      },
      error: () => {
        this.finishLogout();
      }
    });
  }

  private loadEnvironmentInfo(): void {
    this.http.get<EnvironmentInfo>('/api/info/environment').subscribe({
      next: (response) => {
        this.environmentInfo = response;
      },
      error: () => {
        this.environmentInfo = null;
      }
    });
  }

  private logFrontendEnvironment(): void {
    console.log(`[${this.appName}] ${this.frontendMessage}`);
  }
}
