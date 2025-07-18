import { isPlatformBrowser } from "@angular/common";
import { HttpInterceptorFn } from "@angular/common/http";
import { inject, PLATFORM_ID } from "@angular/core";

// Exemplo de verificação de expiração no interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  let token: string | null = null;
  if (isPlatformBrowser(platformId)) {
    token = localStorage.getItem('token');
    if (token) {
      // Decodificar o token para verificar expiração
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      if (isExpired) {
        console.warn('Token expirado, redirecionar para login');
      }
    }
  }

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }
  return next(req);
};
