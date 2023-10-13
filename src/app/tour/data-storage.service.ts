import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { map, tap, take, exhaustMap, catchError } from 'rxjs/operators';
import { Tour } from "./tour.model";
import { TourDetailService } from "./tour-detail/tour-detail.service";
import { BookedTourResponse } from "../booked-tour/booked-tour-response.model";
import { Observable, throwError } from "rxjs";
import { Hotel } from "../hotel/hotel.model";
import { Room } from "../hotel/hotel-room/room.model";
import { Schedule } from "./tour-detail/tour-schedule/schedule.model";
import { Contact } from "../hotel/contact-form/contact.model";

@Injectable({ providedIn: 'root' })
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private tourDetailService: TourDetailService,
    ) {}


    fetchTours() {
        return this.http
        .get<Tour[]>(
          'http://localhost:8080/api/tour'
        )
        .pipe(
            map(tours => {
                // Loại bỏ thuộc tính 'festival' từ mỗi đối tượng 'Tour'
                return tours.map(tour => ({
                    id: tour.id,
                    festival_id: tour.festival_id,
                    name: tour.name,
                    fromWhere: tour.fromWhere,
                    toWhere: tour.toWhere,
                    description: tour.description,
                    fromDate: tour.fromDate,
                    toDate: tour.toDate,
                    capacity: tour.capacity,
                    booked: tour.booked,
                    price: tour.price,
                    canbook: tour.capacity - tour.booked,  //số lượng chỗ còn trống
                    imageDTO: tour.imageDTO,
                    url: null
                }));
            }),
            catchError(this.handleError),
        );
    }

    getTourById(id: number) {
        return this.http
        .get<Tour>(
          `http://localhost:8080/api/tour/${id}`
        )
        .pipe(
            map(tour => {
                return new Tour(
                    tour.id,
                    tour.festival_id,
                    tour.name,
                    tour.fromWhere,
                    tour.toWhere,
                    tour.description,
                    tour.fromDate,
                    tour.toDate,
                    tour.price,
                    tour.capacity,
                    tour.booked,
                    tour.capacity - tour.booked, // Tính toán canbook
                    tour.imageDTO,
                    null
                );
            }),
            tap((tour) => {
               //console.log("Tour khi set cho Tour: ", tour)
                this.tourDetailService.setTourDetail(tour)
            })
        )
    }

    getToursByTouristId(id: number, token: string) {
        return this.http
        .get<BookedTourResponse[]>(
          `http://localhost:8080/api/user/booked/tourist/${id}`
        )
        
    }

    checkout(params: HttpParams): Observable<any> {
        return this.http
        .get<any>(
          'http://localhost:8080/api/payment/create_payment',
          {params: params}
        )
    }

    getPaymentInfo(params: HttpParams): Observable<any> { 
        return this.http.get<any>('http://localhost:8080/api/payment/payment_infor',
                            {params: params}
        )
        .pipe(
            catchError(this.handleError),
        );
    }

    removeBookedTour(bookedtourId: number, touristId: number): Observable<BookedTourResponse[]> {
        const params = new HttpParams().set('touristId', touristId);

        return this.http
        .delete<BookedTourResponse[]>(
          `http://localhost:8080/api/user/booked/${bookedtourId}`,
          {params: params}
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    fetchHotels(): Observable<Hotel[]> {
        return this.http
        .get<Hotel[]>(
          'http://localhost:8080/api/hotel'
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    getHotelById(id: number): Observable<Hotel> {
        return this.http
        .get<Hotel>(
          `http://localhost:8080/api/hotel/${id}`
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    getRoomByHotelId(id: number): Observable<Room[]> {
        return this.http
        .get<Room[]>(
          `http://localhost:8080/api/room/${id}`
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    getRoomById(id: number): Observable<Room> {
        return this.http
        .get<Room>(
          `http://localhost:8080/api/room/find_room/${id}`
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    getImageByHotelId(id: number): Observable<any> {
        return this.http
        .get<any>(
          `http://localhost:8080/api/image/hotel/${id}`
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    getScheduleByTourId(id: number): Observable<Schedule[]> {
        return this.http
        .get<Schedule[]>(
          `http://localhost:8080/api/schedule/${id}`
        )
        .pipe(
            map(schedules => {
                return schedules.map(schedule => ({
                    id: schedule.id,
                    tour_id: schedule.tour_id,
                    day: schedule.day,
                    morning: schedule.morning,
                    evening: schedule.evening,
                    night: schedule.night,
                    imageDTO: schedule.imageDTO,
                    url: null
                }));
            }),
            catchError(this.handleError),
        )
    }

    addContact(fullname: string, email: string,  phone: string, tourist_id: number, room_id: number) : Observable<Contact> {
        return this.http
        .post<Contact>(
          'http://localhost:8080/api/user/contact',
            {
                fullname: fullname,
                email: email,
                phone: phone,
                tourist: {
                    "id": tourist_id
                },
                room: {
                    "id": room_id
                },
            },
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    getContactByTouristId(id: number): Observable<Contact[]> {
        return this.http
        .get<Contact[]>(
          `http://localhost:8080/api/user/contact/${id}`
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    deleteContact(id: number, tourist_id: number): Observable<Contact[]> {
        const params = new HttpParams().set('tourist_id', tourist_id);
        return this.http
        .delete<Contact[]>(
          `http://localhost:8080/api/user/contact/${id}`,
          {params: params}
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    downloadImageByName(name: string): Observable<HttpResponse<Blob>> {
        // const headers = new HttpHeaders({
        //     'Content-Type': 'application/json',
        // });
        return this.http
        .get(
            `http://localhost:8080/api/image/download/${name}`, 
            {
                responseType: 'blob',
                observe: 'response'
            }
        )
        .pipe(
            catchError(this.handleError),
        )
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