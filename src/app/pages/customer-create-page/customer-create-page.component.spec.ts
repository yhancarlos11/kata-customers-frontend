import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CustomerCreatePageComponent } from './customer-create-page.component';
import { CustomerService } from '../../services/customer.service';

describe('CustomerCreatePageComponent', () => {
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;

  beforeEach(async () => {
    customerServiceSpy = jasmine.createSpyObj<CustomerService>('CustomerService', ['create']);

    await TestBed.configureTestingModule({
      imports: [CustomerCreatePageComponent],
      providers: [{ provide: CustomerService, useValue: customerServiceSpy }]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CustomerCreatePageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should create customer and reset form on success', () => {
    let capturedPayload: { name: string; email: string } | null = null;
    customerServiceSpy.create.and.callFake((payload) => {
      capturedPayload = { ...payload };
      return of({ id: 1, name: 'Ana', email: 'ana@email.com' });
    });

    const fixture = TestBed.createComponent(CustomerCreatePageComponent);
    const component = fixture.componentInstance as any;
    component.customerForm.name = 'Ana';
    component.customerForm.email = 'ana@email.com';

    component.submit();

    if (!capturedPayload) {
      fail('Expected payload to be captured before form reset');
      return;
    }

    expect(capturedPayload).toEqual({
      name: 'Ana',
      email: 'ana@email.com'
    });
    expect(component.messageType).toBe('success');
    expect(component.message).toContain('Cliente creado correctamente');
    expect(component.customerForm.name).toBe('');
    expect(component.customerForm.email).toBe('');
  });

  it('should show error message on failure', () => {
    customerServiceSpy.create.and.returnValue(
      throwError(() => ({ error: { message: 'Email duplicado' } }))
    );

    const fixture = TestBed.createComponent(CustomerCreatePageComponent);
    const component = fixture.componentInstance as any;
    component.customerForm.name = 'Ana';
    component.customerForm.email = 'ana@email.com';

    component.submit();

    expect(component.messageType).toBe('error');
    expect(component.message).toBe('Email duplicado');
  });
});
