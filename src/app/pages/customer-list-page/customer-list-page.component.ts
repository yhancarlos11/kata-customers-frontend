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
  protected messageType: 'success' | 'error' = 'success';
  protected editingId: number | null = null;
  protected editForm: CreateCustomerRequest = {
    name: '',
    email: ''
  };
  protected isDeleteModalOpen = false;
  protected pendingDeleteId: number | null = null;
  protected pendingDeleteName = '';

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
        this.messageType = 'error';
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
        this.messageType = 'success';
        this.message = 'Cliente actualizado correctamente.';
        this.load();
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible actualizar el cliente.');
      }
    });
  }

  protected askRemove(customer: Customer): void {
    this.pendingDeleteId = customer.id;
    this.pendingDeleteName = customer.name;
    this.isDeleteModalOpen = true;
  }

  protected closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.pendingDeleteId = null;
    this.pendingDeleteName = '';
  }

  protected confirmRemove(): void {
    if (!this.pendingDeleteId) {
      return;
    }

    this.message = '';
    this.customerService.delete(this.pendingDeleteId).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Cliente eliminado correctamente.';
        this.closeDeleteModal();
        this.load();
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible eliminar el cliente.');
      }
    });
  }

  protected initials(name: string): string {
    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private extractError(error: { error?: { message?: string } }, fallback: string): string {
    return error?.error?.message ?? fallback;
  }
}
