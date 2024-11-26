import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ApiService } from './shared/services/api.service'; // Assuming this is used for further API checks if needed
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private apiService: ApiService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const token = localStorage.getItem('access_token');

    if (token) {
      // Optionally, you can validate the token (e.g., check expiration).
      return true; 
    } else {
      this.router.navigate(['login'], { queryParams: { returnUrl: state.url } }); // Preserve return URL.
      return false;
    }
  }
}
