import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { AuthService } from './auth.service'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard {

    constructor(private authService: AuthService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot, 
        router: RouterStateSnapshot
    ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(
            take(1),
            map(user => {
            const isAuth = !!user;
            if (isAuth) {
                return true;
            }
            return this.router.createUrlTree(['/home']);
        }) 
        // tap(isAuth => {
        //     if (!isAuth) {
        //         this.router.navigate(['/auth']);
        //     }
        // })
        );
    }

}