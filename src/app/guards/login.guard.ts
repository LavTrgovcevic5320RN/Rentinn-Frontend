import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {JwtService} from '../services/jwt/jwt.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const jwtService = inject(JwtService);
  const router = inject(Router);
  const token = localStorage.getItem("jwt");

  if (!token || !jwtService.isTokenFormatValid(token)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
