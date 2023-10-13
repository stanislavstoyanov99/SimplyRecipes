import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate  {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean { 
    if (this.authService.isUserAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url }});
    return false;
  } 
  
}
