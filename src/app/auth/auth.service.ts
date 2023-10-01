import { Injectable } from '@angular/core';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from './user.model';

export interface AuthenticationResponse {
    //kind: string;
    //idToken: string;
    token: string;
    email: string;
    touristId: number;
    username: string;
    fullname: string;
    tokenExpirationDate: number;
    //refreshToken: string;
    //expiresIn: string;
    //localId: string;
    //registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

    user = new BehaviorSubject<User | null>(null);
    private tokenExpirationTimer: any;
    token: string | null = null;

    constructor(private http: HttpClient, private router: Router) {}

    signup(
        fullname: string,
        email: string, 
        username: string,
        password: string,

    ) {
        return this.http.post<AuthenticationResponse>('http://localhost:8080/api/auth/register', 
        {
            fullname: fullname,
            email: email,
            username: username,
            password: password,
        })
        .pipe(
            catchError(this.handleError),
            tap(data => {
                this.handleAuthentication(
                    data.fullname,
                    data.email,
                    data.username,
                    data.touristId,
                    data.token,
                    data.tokenExpirationDate
                )
            })
        );
        
        
        // .pipe(
        //     catchError(this.handleError), 
            
        //     tap(resData => {
        //         console.log(resData);

        //         // this.handleAuthentication(
        //         //     resData.email,
        //         //     resData.localId,
        //         //     resData.idToken,
        //         //     +resData.expiresIn)
        // }));
  
    }


    login(username: string, password: string) {
        return this.http
          .post<AuthenticationResponse>(
            'http://localhost:8080/api/auth/authenticate',
            {
                username: username,
                password: password,
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(data => {
                this.handleAuthentication(
                    data.fullname,
                    data.email,
                    data.username,
                    data.touristId,
                    data.token,
                    data.tokenExpirationDate
                )
            })
        );
    }

    logout() {
        this.user.next(null);
        //this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    private handleAuthentication(
        fullname: string,
        email: string, 
        username: string,
        touristId: number,
        token: string,
        tokenExpirationDate: number

      ) {


        const expirationDate = new Date(new Date().getTime() + tokenExpirationDate);
        const user = new User(token, expirationDate, email, touristId, username, fullname);
        this.user.next(user);
        this.autoLogout(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        //console.log(errorRes)
        let errorMessage = 'Lỗi không xác định';
        if (!errorRes.error || !errorRes.error.message) {
          return throwError(() => new Error (errorMessage));
        }
        // switch (errorRes.error.error.message) {
        //   case 'EMAIL_EXISTS':
        //     errorMessage = 'This email exists already';
        //     break;
        //   case 'EMAIL_NOT_FOUND':
        //     errorMessage = 'This email does not exist.';
        //     break;
        //   case 'INVALID_PASSWORD':
        //     errorMessage = 'This password is not correct.';
        //     break;
        // }
        errorMessage = errorRes.error.message
        return throwError(() => new Error (errorMessage));
        
    }
}