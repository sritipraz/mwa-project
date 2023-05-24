import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import IUser from '../interface/user';
import { UserServiceService } from '../user-service.service';

@Injectable({
  providedIn: 'root'
})
export class NonAdminGuard implements CanActivate {
  userService = inject(UserServiceService);
  router = inject(Router);
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user: IUser = this.userService.getUserState();
      if ((!user.jwt) || (user.jwt && !user.isAdmin)) {
          return true;
      } else {
        if (user.jwt && user.isAdmin) this.router.navigate(['/admin']);
        else this.router.navigate(['/login']);
        return false;
      }
  }
}