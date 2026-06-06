import { Component, OnInit, inject } from '@angular/core';
import { Customer, CreateCustomerRequest } from '../../models/api.models';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-list-page',
  imports: [FormsModule],
  templateUrl: './customer-list-page.component.html',
  styleUrl: './customer-list-page.component.scss'
})
export class CustomerListPageComponent implements OnInit {
  private readonly customerService = inject(CustomerService);

  protected customers: Customer[] = [];
  protected message = '';
  protected editingId: number | null = null;
  protected editForm: CreateCustomerRequest = {
    name: '',
    email: ''
  };

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.message = '';
    this.editingId = null;
    this.customerService.list().subscribe({
      next: (response) => {
        this.customers = response;
      },
      error: (error) => {
        this.message = this.extractError(error, 'No fue posible listar clientes.');
      }
    });
  }

  protected startEdit(customer: Customer): void {
    this.message = '';
    this.editingId = customer.id;
    this.editForm = {
      name: customer.name,
      email: customer.email
    };
  }

  protected cancelEdit(): void {
    this.editingId = null;
  }

  protected saveEdit(customerId: number): void {
    this.message = '';
    this.customerService.update(customerId, this.editForm).subscribe({
      next: () => {
        this.message = 'Cliente actualizado correctamente.';
        this.load();
      },
      error: (error) => {
        this.message = this.extractError(error, 'No fue posible actualizar el cliente.');
      }
    });
  }

  protected remove(customerId: number): void {
    const confirmed = window.confirm('Esta accion eliminara el cliente. Deseas continuar?');
    if (!confirmed) {
      return;
    }

    this.message = '';
    this.customerService.delete(customerId).subscribe({
      next: () => {
        this.message = 'Cliente eliminado correctamente.';
        this.load();
      },
      error: (error) => {
        this.message = this.extractError(error, 'No fue posible eliminar el cliente.');
      }
    });
  }

  private extractError(error: { error?: { message?: string } }, fallback: string): string {
    return error?.error?.message ?? fallback;
  }
}
