import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly appName = environment.appName;
  protected readonly frontendMessage = environment.logMessage;

  protected readonly isAuthenticated = this.authService.isAuthenticated;

  ngOnInit(): void {
    this.logFrontendEnvironment();
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

  private logFrontendEnvironment(): void {
    console.log(`[${this.appName}] ${this.frontendMessage}`);
  }
}
