import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Tour } from "./tour.model";
import { TourDetailService } from "./tour-detail/tour-detail.service";

@Injectable({ providedIn: 'root' })
export class DataStorageService {



    constructor(
        private http: HttpClient,
        private tourDetailService: TourDetailService
        
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
                    name: tour.name,
                    fromWhere: tour.fromWhere,
                    toWhere: tour.toWhere,
                    description: tour.description,
                    fromDate: tour.fromDate,
                    toDate: tour.toDate,
                    capacity: tour.capacity,
                    booked: tour.booked,
                    price: tour.price,
                    canbook: tour.capacity - tour.booked
                }));
            })
        );
    }

    getTourById(id: number) {
        return this.http
        .get<Tour>(
          `http://localhost:8080/api/tour/${id}`
        )
        .pipe(
            map(tour => {
                const { id, name, fromWhere, toWhere, description, fromDate, toDate, price, capacity, booked } = tour;
                const canbook = capacity - booked;
                return { id, name, fromWhere, toWhere, description, fromDate, toDate, price, capacity, booked, canbook };
            }),
            tap((tour) => {
               console.log("Tour khi set cho Tour: ", tour)
                this.tourDetailService.setTourDetail(tour)
            })
        )
    }
}