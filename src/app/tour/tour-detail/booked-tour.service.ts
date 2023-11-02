import { Injectable } from "@angular/core";
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

import { DataStorageService } from "../data-storage.service";
import { TourDetailService } from "./tour-detail.service";
import { Tour } from "../tour.model";

@Injectable({ providedIn: 'root' })
export class BookedTourService {


    constructor(
        private tourDetailService: TourDetailService,
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
            tap((data) => {

                
                const tour: Tour = new Tour(
                    data.tourDto.id,
                    data.tourDto.festival_id,
                    data.tourDto.name,
                    data.tourDto.fromWhere,
                    data.tourDto.toWhere,
                    data.tourDto.description,
                    data.tourDto.fromDate,
                    data.tourDto.toDate,
                    data.tourDto.priceAdult,
                    data.tourDto.priceChild,
                    data.tourDto.priceBaby,
                    data.tourDto.capacity,
                    data.tourDto.booked,
                    data.tourDto.capacity - data.tourDto.booked, // Tính toán canbook
                    data.tourDto.imageDTO,
                    data.tourDto.hotelDTOs,
                    null
                );
                
                this.tourDetailService.setTourDetail(tour);

                // this.dataStorageService.getTourById(tourId).subscribe((tour) => {
                //     //console.log("Sau khi booked: ", tour);
                // })
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