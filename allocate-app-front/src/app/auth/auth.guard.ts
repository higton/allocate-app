import { Injectable } from '@angular/core';
import { CanDeactivate, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ServerService } from './services/server.service';

import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class authActivate implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private server: ServerService,
    ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    let url: string = state.url;

    return await this.authService.isLogged(url);
  }
}
@Injectable({
  providedIn: 'root'
})
export class authDeactivate implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private server: ServerService,
    ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){
    let url: string = state.url;
    let isLogged = await this.authService.isLogged(url);
    if(isLogged){
      console.log('isLogged', isLogged);
      this.router.navigate(['/home']);
    }
    return !isLogged;
  }
}
