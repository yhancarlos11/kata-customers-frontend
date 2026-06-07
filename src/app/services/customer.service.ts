import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateCustomerRequest,
  CreateProductRequest,
  Customer,
  CustomerDetail,
  Product
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);

  create(payload: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>('/api/customers', payload);
  }

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>('/api/customers');
  }

  getById(customerId: number): Observable<CustomerDetail> {
    return this.http.get<CustomerDetail>(`/api/customers/${customerId}`);
  }

  update(customerId: number, payload: CreateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`/api/customers/${customerId}`, payload);
  }

  delete(customerId: number): Observable<void> {
    return this.http.delete<void>(`/api/customers/${customerId}`);
  }

  createProduct(customerId: number, payload: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(`/api/customers/${customerId}/products`, payload);
  }

  updateProduct(customerId: number, productId: number, payload: CreateProductRequest): Observable<Product> {
    return this.http.put<Product>(`/api/customers/${customerId}/products/${productId}`, payload);
  }

  deleteProduct(customerId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`/api/customers/${customerId}/products/${productId}`);
  }
}
