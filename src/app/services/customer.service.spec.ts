import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call list endpoint', () => {
    service.list().subscribe((customers) => {
      expect(customers.length).toBe(1);
      expect(customers[0].name).toBe('Ana');
    });

    const req = httpMock.expectOne('/api/customers');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: 1, name: 'Ana', email: 'ana@email.com' }]);
  });

  it('should call update endpoint with customer payload', () => {
    service.update(10, { name: 'Ana Actualizada', email: 'ana2@email.com' }).subscribe((customer) => {
      expect(customer.id).toBe(10);
      expect(customer.name).toBe('Ana Actualizada');
    });

    const req = httpMock.expectOne('/api/customers/10');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Ana Actualizada', email: 'ana2@email.com' });
    req.flush({ id: 10, name: 'Ana Actualizada', email: 'ana2@email.com' });
  });

  it('should call customer detail endpoint', () => {
    service.getById(3).subscribe((customer) => {
      expect(customer.id).toBe(3);
      expect(customer.products.length).toBe(1);
    });

    const req = httpMock.expectOne('/api/customers/3');
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 3,
      name: 'Carla',
      email: 'carla@email.com',
      createdAt: '2026-06-06T10:00:00',
      products: [{ id: 7, name: 'Producto A', price: 10000, description: 'Demo' }]
    });
  });

  it('should call create product endpoint', () => {
    service.createProduct(5, { name: 'Producto Nuevo', price: 25000, description: 'Nuevo' }).subscribe((product) => {
      expect(product.id).toBe(11);
      expect(product.name).toBe('Producto Nuevo');
    });

    const req = httpMock.expectOne('/api/customers/5/products');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 11, name: 'Producto Nuevo', price: 25000, description: 'Nuevo' });
  });
});
