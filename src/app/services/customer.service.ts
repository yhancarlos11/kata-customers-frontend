import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateCustomerRequest, Customer } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);

  create(payload: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>('/api/customers', payload);
  }

  list(): Observable<Customer[]> {
    return this.http.get<Customer[]>('/api/customers');
  }

  update(customerId: number, payload: CreateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`/api/customers/${customerId}`, payload);
  }

  delete(customerId: number): Observable<void> {
    return this.http.delete<void>(`/api/customers/${customerId}`);
  }
}
