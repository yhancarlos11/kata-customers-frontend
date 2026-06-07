import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CustomerListPageComponent } from './customer-list-page.component';
import { CustomerService } from '../../services/customer.service';

describe('CustomerListPageComponent', () => {
  let customerServiceSpy: jasmine.SpyObj<CustomerService>;

  beforeEach(async () => {
    customerServiceSpy = jasmine.createSpyObj<CustomerService>('CustomerService', [
      'list',
      'update',
      'delete',
      'getById',
      'createProduct',
      'updateProduct',
      'deleteProduct'
    ]);

    customerServiceSpy.list.and.returnValue(of([{ id: 1, name: 'Yhan', email: 'yhan@correo.com' }]));
    customerServiceSpy.getById.and.returnValue(
      of({
        id: 1,
        name: 'Yhan',
        email: 'yhan@correo.com',
        createdAt: '2026-06-06T10:00:00',
        products: []
      })
    );

    await TestBed.configureTestingModule({
      imports: [CustomerListPageComponent],
      providers: [{ provide: CustomerService, useValue: customerServiceSpy }]
    }).compileComponents();
  });

  it('should load customers on init', () => {
    const fixture = TestBed.createComponent(CustomerListPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    expect(customerServiceSpy.list).toHaveBeenCalled();
    expect(component.customers.length).toBe(1);
    expect(component.customers[0].name).toBe('Yhan');
  });

  it('should start and cancel edit mode', () => {
    const fixture = TestBed.createComponent(CustomerListPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.startEdit({ id: 10, name: 'Ana', email: 'ana@email.com' });
    expect(component.editingId).toBe(10);
    expect(component.editForm).toEqual({ name: 'Ana', email: 'ana@email.com' });

    component.cancelEdit();
    expect(component.editingId).toBeNull();
  });

  it('should save edit and reload list', () => {
    customerServiceSpy.update.and.returnValue(of({ id: 1, name: 'Yhan A', email: 'yhan@correo.com' }));

    const fixture = TestBed.createComponent(CustomerListPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.editForm = { name: 'Yhan A', email: 'yhan@correo.com' };
    component.saveEdit(1);

    expect(customerServiceSpy.update).toHaveBeenCalledWith(1, {
      name: 'Yhan A',
      email: 'yhan@correo.com'
    });
    expect(component.messageType).toBe('success');
    expect(component.message).toBe('');
    expect(customerServiceSpy.list).toHaveBeenCalledTimes(2);
  });

  it('should delete customer from modal confirmation and reload list', () => {
    customerServiceSpy.delete.and.returnValue(of(void 0));

    const fixture = TestBed.createComponent(CustomerListPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    component.askRemove({ id: 1, name: 'Yhan', email: 'yhan@correo.com' });
    expect(component.isDeleteModalOpen).toBeTrue();

    component.confirmRemove();

    expect(customerServiceSpy.delete).toHaveBeenCalledWith(1);
    expect(component.messageType).toBe('success');
    expect(component.isDeleteModalOpen).toBeFalse();
    expect(customerServiceSpy.list).toHaveBeenCalledTimes(2);
  });

  it('should show error message when listing fails', () => {
    customerServiceSpy.list.and.returnValue(
      throwError(() => ({ error: { message: 'Fallo al consultar' } }))
    );

    const fixture = TestBed.createComponent(CustomerListPageComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance as any;

    expect(component.messageType).toBe('error');
    expect(component.message).toBe('Fallo al consultar');
  });

  it('should generate initials from full name', () => {
    const fixture = TestBed.createComponent(CustomerListPageComponent);
    const component = fixture.componentInstance as any;

    expect(component.initials('Juan Perez')).toBe('JP');
    expect(component.initials('maria')).toBe('M');
  });
});
