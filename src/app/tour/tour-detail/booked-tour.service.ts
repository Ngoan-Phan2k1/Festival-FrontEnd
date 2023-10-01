import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataStorageService } from "../data-storage.service";

@Injectable({ providedIn: 'root' })
export class BookedTourService {


    constructor(
        private dataStorageService: DataStorageService,
        private http: HttpClient
    ) {}

    bookedTour(
        booked: number,
        phone: string,
        tourId: number,
        touristId: number
    ) {

        const userData: {
            fullname: string;
            touristId: number;
            username: string;
            _token: string;
            _tokenExpirationDate: string;
        } = JSON.parse(localStorage.getItem('userData'));


        //console.log(userData);

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + userData._token
        });

        return this.http.post<any>('http://localhost:8080/api/user/booked', 
            {
                booked: booked,
                phone: phone,
                tour: {
                    "id": tourId
                },
                tourist: {
                    "id": touristId
                },
            },
            { headers: headers}
        )
        .pipe(
            catchError(this.handleError),
            tap(() => {

                //this.dataStorageService.getTourById(tourId)

                this.dataStorageService.getTourById(tourId).subscribe((tour) => {
                    //console.log("Sau khi booked: ", tour);
                })
            })
            
        );
    }

    private handleError(errorRes: HttpErrorResponse) {
        
        let errorMessage = 'Lỗi không xác định';
        if (!errorRes.error || !errorRes.error.message) {
            return throwError(() => new Error (errorMessage));
        }
        
        errorMessage = errorRes.error.message
        return throwError(() => new Error (errorMessage));
    }
}