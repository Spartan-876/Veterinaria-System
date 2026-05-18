import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }
  const rol = auth.getRol();
  if (rol === 'ROLE_USER') {
    router.navigate(['/inicio']);
    return false;
  }

  return true;
};
