import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {Promise} from 'q';

@Injectable()
export class AuthorizationService implements CanActivate {

  public static readonly authTokenKey = 'token';
  public static readonly userId = 'userId';
  public static readonly role = 'role';
  public static readonly username = 'username';

  constructor(private router: Router) {}

  login(object) {
    localStorage.setItem(AuthorizationService.authTokenKey, object['token']);
    localStorage.setItem(AuthorizationService.userId, object['userId']);
    localStorage.setItem(AuthorizationService.role, object['role']);
    localStorage.setItem(AuthorizationService.username, object['username']);
    this.router.navigateByUrl('/forum');
  }

  logout() {
    localStorage.removeItem(AuthorizationService.authTokenKey);
    localStorage.removeItem(AuthorizationService.userId);
    localStorage.removeItem(AuthorizationService.role);
    localStorage.removeItem(AuthorizationService.username);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem(AuthorizationService.authTokenKey);
  }

  isLoggedIn() {
    const token = this.getToken();
    return token != null && token !== '';
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
