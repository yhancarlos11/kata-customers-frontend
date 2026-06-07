import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should save JWT in localStorage on login', () => {
    service.login({ username: 'demo', password: 'secret' }).subscribe();

    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'jwt-token-login', refreshToken: 'refresh-token-login' });

    expect(localStorage.getItem('kata.jwt')).toBe('jwt-token-login');
    expect(localStorage.getItem('kata.rjwt')).toBe('refresh-token-login');
    expect(service.hasToken()).toBeTrue();
  });

  it('should remove JWT on logout', () => {
    localStorage.setItem('kata.jwt', 'jwt-existing');
    localStorage.setItem('kata.rjwt', 'refresh-existing');

    expect(service.hasToken()).toBeTrue();

    service.logout().subscribe((response) => {
      expect(response.message).toContain('Sesión cerrada');
    });

    const req = httpMock.expectOne('/api/auth/logout');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.refreshToken).toBe('refresh-existing');
    req.flush({ message: 'Sesión cerrada correctamente' });

    expect(localStorage.getItem('kata.jwt')).toBeNull();
    expect(localStorage.getItem('kata.rjwt')).toBeNull();
    expect(service.hasToken()).toBeFalse();
  });
});
