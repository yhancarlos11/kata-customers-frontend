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

  ngOnInit(): void {
    this.logFrontendEnvironment();
    this.loadEnvironmentInfo();
  }

  protected logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
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
