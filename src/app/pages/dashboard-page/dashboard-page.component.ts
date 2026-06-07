import { Component } from '@angular/core';
import { CustomerCreatePageComponent } from '../customer-create-page/customer-create-page.component';
import { CustomerListPageComponent } from '../customer-list-page/customer-list-page.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [CustomerCreatePageComponent, CustomerListPageComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {}
