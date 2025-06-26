import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
// import { ProfessionalRegisterComponent } from './features/professional-register/professional-register.component';
import { ProfessionalSearchComponent } from './features/professional-search/professional-search.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  // { path: 'register', component: ProfessionalRegisterComponent },
  { path: 'search', component: ProfessionalSearchComponent },
];
