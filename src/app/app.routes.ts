import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { BookStoreComponent } from './books/book-store/book-store.component';
import { UserOrdersComponent } from './users/user-orders/user-orders.component';
import { ProfileComponent } from './users/profile/profile.component';
import { MaintenanceComponent } from './books/maintenance/maintenance.component';
import { ReturnBookComponent } from './books/return-book/return-book.component';
import { ApprovalRequestsComponent } from './users/approval-requests/approval-requests.component';
import { AllOrdersComponent } from './users/all-orders/all-orders.component';
import { ViewUsersComponent } from './users/view-users/view-users.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: BookStoreComponent, canActivate: [AuthGuard] },
  { path: 'my-orders', component: UserOrdersComponent, canActivate: [AuthGuard] },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [AuthGuard] },
  { path: 'return-book', component: ReturnBookComponent, canActivate: [AuthGuard] },
  { path: 'approval-requests', component: ApprovalRequestsComponent, canActivate: [AuthGuard] },
  { path: 'all-orders', component: AllOrdersComponent, canActivate: [AuthGuard] },
  { path: "view-users", component: ViewUsersComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', component: LoginComponent },
];
