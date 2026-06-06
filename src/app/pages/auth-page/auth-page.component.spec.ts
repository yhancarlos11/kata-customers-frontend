import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthPageComponent } from './auth-page.component';
import { AuthService } from '../../services/auth.service';

describe('AuthPageComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'register']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [AuthPageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AuthPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should switch mode and clear message', () => {
    const fixture = TestBed.createComponent(AuthPageComponent);
    const component = fixture.componentInstance as any;
    component.message = 'error previo';

    component.switchMode('register');

    expect(component.mode()).toBe('register');
    expect(component.message).toBe('');
  });

  it('should open success modal on login success and navigate on close', () => {
    authServiceSpy.login.and.returnValue(of({ token: 'jwt-token' }));

    const fixture = TestBed.createComponent(AuthPageComponent);
    const component = fixture.componentInstance as any;
    component.loginForm.username = 'demo';
    component.loginForm.password = 'secret';

    component.submitLogin();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ username: 'demo', password: 'secret' });
    expect(component.isSuccessModalOpen).toBeTrue();
    expect(component.successModalMessage).toContain('Has iniciado sesion exitosamente');
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();

    component.closeSuccessModal();
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/customers/create');
  });

  it('should set error message on register failure', () => {
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ error: { message: 'Usuario ya existe' } }))
    );

    const fixture = TestBed.createComponent(AuthPageComponent);
    const component = fixture.componentInstance as any;

    component.submitRegister();

    expect(component.messageType).toBe('error');
    expect(component.message).toBe('Usuario ya existe');
  });
});
