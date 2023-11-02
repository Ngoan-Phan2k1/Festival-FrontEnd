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
import { UserInfo } from "../account-info/user-info/userinfo.model";
import { ImageDTO } from "../hotel/image.model";
import { OrderTour } from "../account-info/order/order-tour.model";

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
                    priceAdult: tour.priceAdult,
                    priceChild: tour.priceChild,
                    priceBaby: tour.priceBaby,
                    capacity: tour.capacity,
                    booked: tour.booked,    
                    canbook: tour.capacity - tour.booked,  //số lượng chỗ còn trống
                    imageDTO: tour.imageDTO,
                    hotelDTOs: tour.hotelDTOs,
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
                    tour.priceAdult,
                    tour.priceChild,
                    tour.priceBaby,
                    tour.capacity,
                    tour.booked,
                    tour.capacity - tour.booked, // Tính toán canbook
                    tour.imageDTO,
                    tour.hotelDTOs,
                    null
                );
            }),
            tap((tour) => {
               //console.log("Tour khi set cho Tour: ", tour)
                this.tourDetailService.setTourDetail(tour)
            })
        )
    }

    getToursByTouristId(id: number, token: string): Observable<OrderTour[]> {
        return this.http
        .get<OrderTour[]>(
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

    removeBookedTour(bookedtourId: number, touristId: number): Observable<OrderTour[]> {
        const params = new HttpParams().set('touristId', touristId);

        return this.http
        .delete<OrderTour[]>(
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

    getTouristById(id: number): Observable<UserInfo> {
        return this.http
        .get<UserInfo>(
          `http://localhost:8080/api/tourist/${id}`
        )
        .pipe(
            catchError(this.handleError),
            // tap((user) => {

            // })
        )
    }

    updateTourist(tourist_id: number, fullname: string, username: string, email: string, params: HttpParams): Observable<UserInfo> {
        //const params = new HttpParams().set('tourist_id', tourist_id);
        return this.http
        .put<UserInfo>(
          `http://localhost:8080/api/tourist/${tourist_id}`,
          {
            "fullname": fullname,
            "username": username,
            "email": email
          },
          {params: params}
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    uploadImage(file: File): Observable<ImageDTO> {
        const formData = new FormData();
        formData.append('image', file);

        return this.http
        .post<ImageDTO>(
            'http://localhost:8080/api/image',
            formData
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

    bookedTour(
        bookedAdult: number,
        bookedChild:  number,
        bookedBaby: number,
        fullname: string,
        email: string,
        address: string,
        note: string,
        num_room: number,
        phone: string,
        tour_id: number,
        tourist_id: number,
        room_id: number,
        token: string
    ) {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + token
        });

        return this.http.post<any>('http://localhost:8080/api/user/booked', 
            {
                bookedAdult: bookedAdult,
                bookedChild: bookedChild,
                bookedBaby: bookedBaby,
                fullname: fullname,
                email: email,
                address: address,
                note: note,
                num_room: num_room,
                phone: phone,
                room: {
                    "id": room_id
                },
                tour: {
                    "id": tour_id
                },
                tourist: {
                    "id": tourist_id
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
            })
            
        );
    }

    prediction(image: File): Observable<any> {
        const formData = new FormData();
        formData.append('image', image);

        return this.http
        .post<any>(
            'http://localhost:5000/predict',
            formData
        )
        .pipe(
            catchError(this.handleError),
        )
    }

    private handleError(errorRes: HttpErrorResponse) {
        
        console.log(errorRes);
        let errorMessage = 'Lỗi không xác định';
        if (!errorRes.error || !errorRes.error.message) {
            return throwError(() => new Error (errorMessage));
        }
        
        errorMessage = errorRes.error.message
        return throwError(() => new Error (errorMessage));
    }



}