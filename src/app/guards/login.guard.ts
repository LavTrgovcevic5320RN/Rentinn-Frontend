// import {CanActivateFn, Router} from '@angular/router';
// import {inject} from '@angular/core';
// import {JwtService} from '../services/jwt/jwt.service';
//
// export const loginGuard: CanActivateFn = (route, state) => {
//   const jwtService = inject(JwtService);
//   const router = inject(Router);
//   const token = localStorage.getItem("jwt");
//
//   if (!token || !jwtService.isTokenFormatValid(token)) {
//     router.navigate(['/login']);
//     return false;
//   }
//
//   return true;
// };


import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class loginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Store the attempted URL for redirecting after login
      localStorage.setItem('redirectUrl', state.url);
      this.router.navigate(['/login']); // Navigate to the login page
      return false;
    }
  }
}
