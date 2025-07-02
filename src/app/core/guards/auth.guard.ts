import { inject, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    if (authService.isAuthenticated()) {
      console.log(`Usuário autenticado, permitindo acesso à rota ${state.url}`);
      return true;
    }
    console.log(`Usuário não autenticado, redirecionando para /login de ${state.url}`);
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  console.log(`SSR: Bloqueando acesso à rota ${state.url}`);
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
