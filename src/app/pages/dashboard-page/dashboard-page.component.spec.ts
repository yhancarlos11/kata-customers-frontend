import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardPageComponent } from './dashboard-page.component';
import { CustomerService } from '../../services/customer.service';

describe('DashboardPageComponent', () => {
  beforeEach(async () => {
    const customerServiceMock = {
      list: () => of([]),
      create: () => of({}),
      update: () => of({}),
      delete: () => of(void 0)
    };

    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent],
      providers: [{ provide: CustomerService, useValue: customerServiceMock }]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render create and list sections', () => {
    const fixture = TestBed.createComponent(DashboardPageComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Listado y gestion de clientes');
    expect(compiled.textContent).toContain('Crear cliente');
    expect(compiled.textContent).toContain('Listado de clientes');
  });
});
