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
  protected fieldErrors: Partial<Record<'name' | 'email', string>> = {};

  protected submit(): void {
    this.message = '';
    this.fieldErrors = this.validateForm();
    if (Object.keys(this.fieldErrors).length > 0) {
      this.messageType = 'error';
      this.message = 'Corrige los errores del formulario.';
      return;
    }

    this.customerService.create(this.customerForm).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Cliente creado correctamente.';
        this.fieldErrors = {};
        this.customerForm.name = '';
        this.customerForm.email = '';
      },
      error: (error) => {
        this.fieldErrors = this.extractValidationErrors(error) as Partial<Record<'name' | 'email', string>>;
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible crear el cliente.');
      }
    });
  }

  private validateForm(): Partial<Record<'name' | 'email', string>> {
    const errors: Partial<Record<'name' | 'email', string>> = {};
    if (!this.customerForm.name?.trim()) {
      errors.name = 'El nombre es obligatorio.';
    }
    if (!this.customerForm.email?.trim()) {
      errors.email = 'El correo es obligatorio.';
    } else if (!this.isValidEmail(this.customerForm.email)) {
      errors.email = 'Debes ingresar un correo electronico valido.';
    }
    return errors;
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private extractValidationErrors(error: { error?: { validationErrors?: Record<string, string> } }): Record<string, string> {
    return error?.error?.validationErrors ?? {};
  }

  private extractError(
    error: { error?: { message?: string; validationErrors?: Record<string, string> } },
    fallback: string
  ): string {
    const validationErrors = error?.error?.validationErrors;
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      return Object.values(validationErrors)[0];
    }
    return error?.error?.message ?? fallback;
  }
}
