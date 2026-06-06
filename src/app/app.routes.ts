import { Routes } from '@angular/router';
import { guestGuard, authGuard } from './app.guards';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { CustomerCreatePageComponent } from './pages/customer-create-page/customer-create-page.component';
import { CustomerListPageComponent } from './pages/customer-list-page/customer-list-page.component';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'auth'
	},
	{
		path: 'auth',
		component: AuthPageComponent,
		canActivate: [guestGuard]
	},
	{
		path: 'customers/create',
		component: CustomerCreatePageComponent,
		canActivate: [authGuard]
	},
	{
		path: 'customers/list',
		component: CustomerListPageComponent,
		canActivate: [authGuard]
	},
	{
		path: '**',
		redirectTo: 'auth'
	}
];
