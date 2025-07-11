import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProfessionalRegisterComponent } from './features/professional-register/professional-register.component';
import { ProfessionalSearchComponent } from './features/professional-search/professional-search.component';
import { LoginComponent } from './shared/components/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { ProfessionalDetails } from './features/professional-details/professional-details';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'professional-register',
    component: ProfessionalRegisterComponent,
    canActivate: [authGuard]
  },
  {
    path: 'professional-search',
    component: ProfessionalSearchComponent,
    canActivate: [authGuard]
  },
  {
    path: 'professional-details',
    component: ProfessionalDetails,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
