import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

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
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '' },
];

