import { Component, OnInit, inject } from '@angular/core';
import {
  CreateCustomerRequest,
  CreateProductRequest,
  Customer,
  CustomerDetail,
  Product
} from '../../models/api.models';
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
  protected editErrors: Partial<Record<'name' | 'email', string>> = {};
  protected isDeleteModalOpen = false;
  protected pendingDeleteId: number | null = null;
  protected pendingDeleteName = '';

  protected isDetailModalOpen = false;
  protected selectedCustomer: CustomerDetail | null = null;
  protected products: Product[] = [];
  protected productForm: CreateProductRequest = {
    name: '',
    price: 0,
    description: ''
  };
  protected productErrors: Partial<Record<'name' | 'price', string>> = {};
  protected editingProductId: number | null = null;

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
    this.editErrors = {};
    this.editingId = customer.id;
    this.editForm = {
      name: customer.name,
      email: customer.email
    };
  }

  protected cancelEdit(): void {
    this.editErrors = {};
    this.editingId = null;
  }

  protected saveEdit(customerId: number): void {
    this.message = '';
    this.editErrors = this.validateCustomerEditForm();
    if (Object.keys(this.editErrors).length > 0) {
      this.messageType = 'error';
      this.message = 'Corrige los errores del formulario de cliente.';
      return;
    }

    this.customerService.update(customerId, this.editForm).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Cliente actualizado correctamente.';
        this.load();
      },
      error: (error) => {
        this.editErrors = this.extractValidationErrors(error) as Partial<Record<'name' | 'email', string>>;
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

  protected viewDetails(customerId: number): void {
    this.message = '';
    this.customerService.getById(customerId).subscribe({
      next: (detail) => {
        this.selectedCustomer = detail;
        this.products = detail.products ?? [];
        this.resetProductForm();
        this.isDetailModalOpen = true;
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible consultar el detalle del cliente.');
      }
    });
  }

  protected closeDetailModal(): void {
    this.isDetailModalOpen = false;
    this.selectedCustomer = null;
    this.products = [];
    this.resetProductForm();
  }

  protected saveProduct(): void {
    if (!this.selectedCustomer) {
      return;
    }

    this.productErrors = this.validateProductForm();
    if (Object.keys(this.productErrors).length > 0) {
      this.messageType = 'error';
      this.message = 'Corrige los errores del formulario de producto.';
      return;
    }

    const customerId = this.selectedCustomer.id;
    const action = this.editingProductId
      ? this.customerService.updateProduct(customerId, this.editingProductId, this.productForm)
      : this.customerService.createProduct(customerId, this.productForm);

    action.subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = this.editingProductId
          ? 'Producto actualizado correctamente.'
          : 'Producto creado correctamente.';
        this.refreshDetails(customerId);
      },
      error: (error) => {
        this.productErrors = this.extractValidationErrors(error) as Partial<
          Record<'name' | 'price', string>
        >;
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible guardar el producto.');
      }
    });
  }

  protected editProduct(product: Product): void {
    this.editingProductId = product.id;
    this.productForm = {
      name: product.name,
      price: product.price,
      description: product.description ?? ''
    };
  }

  protected removeProduct(productId: number): void {
    if (!this.selectedCustomer) {
      return;
    }

    this.customerService.deleteProduct(this.selectedCustomer.id, productId).subscribe({
      next: () => {
        this.messageType = 'success';
        this.message = 'Producto eliminado correctamente.';
        this.refreshDetails(this.selectedCustomer!.id);
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = this.extractError(error, 'No fue posible eliminar el producto.');
      }
    });
  }

  protected cancelProductEdit(): void {
    this.resetProductForm();
  }

  protected formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(price);
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

  private refreshDetails(customerId: number): void {
    this.customerService.getById(customerId).subscribe({
      next: (detail) => {
        this.selectedCustomer = detail;
        this.products = detail.products ?? [];
        this.resetProductForm();
      },
      error: () => {
        this.closeDetailModal();
      }
    });
  }

  private resetProductForm(): void {
    this.editingProductId = null;
    this.productErrors = {};
    this.productForm = {
      name: '',
      price: 0,
      description: ''
    };
  }

  private validateCustomerEditForm(): Partial<Record<'name' | 'email', string>> {
    const errors: Partial<Record<'name' | 'email', string>> = {};
    if (!this.editForm.name?.trim()) {
      errors.name = 'El nombre es obligatorio.';
    }
    if (!this.editForm.email?.trim()) {
      errors.email = 'El correo es obligatorio.';
    } else if (!this.isValidEmail(this.editForm.email)) {
      errors.email = 'Debes ingresar un correo electrónico válido.';
    }
    return errors;
  }

  private validateProductForm(): Partial<Record<'name' | 'price', string>> {
    const errors: Partial<Record<'name' | 'price', string>> = {};
    if (!this.productForm.name?.trim()) {
      errors.name = 'El nombre del producto es obligatorio.';
    }
    if (this.productForm.price == null || Number(this.productForm.price) <= 0) {
      errors.price = 'El precio debe ser mayor a 0.';
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
