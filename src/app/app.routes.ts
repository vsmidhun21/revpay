import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { businessGuard } from './core/guards/business.guard';
import { ShellComponent } from './shared/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/legal/privacy-policy/privacy-policy.component')
      .then(m => m.PrivacyPolicyComponent),
  },
  {
    path: 'terms-conditions',
    loadComponent: () => import('./pages/legal/terms-conditions/terms-conditions.component')
      .then(m => m.TermsConditionsComponent),
  },
  {
    path: 'init',
    loadComponent: () => import('./pages/profile/profile-init/profile-init.component').then(m => m.ProfileInitComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'setup/personal',
    loadComponent: () => import('./pages/profile/personal-setup/personal-setup.component').then(m => m.PersonalSetupComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'setup/business',
    loadComponent: () => import('./pages/profile/business-setup/business-setup.component').then(m => m.BusinessSetupComponent),
    canActivate: [AuthGuard]
  },

  // Protected — All authenticated users
  {
    path: 'dashboard',
    component: ShellComponent,
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { path: 'transactions', canActivate: [AuthGuard], component: ShellComponent,
    loadComponent: () => import('./pages/transactions/transactions.component').then(m => m.TransactionsComponent) 
  },
  { path: 'payment-methods',  canActivate: [AuthGuard], component: ShellComponent,
    loadComponent: () => import('./pages/payment-methods/payment-methods.component').then(m => m.PaymentMethodsComponent) 
  },
  { path: 'requests',         canActivate: [AuthGuard], component: ShellComponent,
    loadComponent: () => import('./pages/requests/requests.component').then(m => m.RequestsComponent) },
  { path: 'send-money',       canActivate: [AuthGuard], component: ShellComponent,
    loadComponent: () => import('./pages/send-money/send-money.component').then(m => m.SendMoneyComponent) },
  { path: 'notifications',    canActivate: [AuthGuard], component: ShellComponent,
    loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent) },
  { path: 'settings',         canActivate: [AuthGuard], component: ShellComponent,
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent) },

  // Protected — Business only
  { path: 'invoices',   canActivate: [AuthGuard, businessGuard], component: ShellComponent,
     loadComponent: () => import('./pages/invoices/invoices.component').then(m => m.InvoicesComponent) 
    },
  { path: 'loans',      canActivate: [AuthGuard, businessGuard], component: ShellComponent,
    loadComponent: () => import('./pages/loans/loans.component').then(m => m.LoansComponent) },
  { path: 'analytics',  canActivate: [AuthGuard, businessGuard], component: ShellComponent,
    loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent) },

  { path: '**', redirectTo: '' },
];

