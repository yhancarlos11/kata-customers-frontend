import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateCustomerRequest } from '../../models/api.models';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-create-page',
  imports: [FormsModule],
  templateUrl: './customer-create-page.component.html',
  styleUrl: './customer-create-page.component.scss'
})
export class CustomerCreatePageComponent {
  private readonly customerService = inject(CustomerService);

  protected readonly customerForm: CreateCustomerRequest = {
    name: '',
    email: ''
  };
  protected message = '';
  protected messageType: 'success' | 'error' = 'success';

  protected submit(): void {
    this.message = '';
    this.customerService.create(this.customerForm).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Cliente creado correctamente.';
        this.customerForm.name = '';
        this.customerForm.email = '';
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible crear el cliente.');
      }
    });
  }

  private extractError(error: { error?: { message?: string } }, fallback: string): string {
    return error?.error?.message ?? fallback;
  }
}
