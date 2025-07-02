import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        if (isPlatformBrowser(platformId)) {
          console.log(`Erro 401 em ${req.url}, redirecionando para /login`);
          localStorage.removeItem('token');
          router.navigate(['/login'], { queryParams: { returnUrl: req.url } });
        } else {
          console.log(`Erro 401 em ${req.url} no SSR, retornando erro`);
        }
      }
      return throwError(() => error);
    })
  );
};
