import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Tour } from "./tour.model";

@Injectable({ providedIn: 'root' })
export class DataStorageService {



    constructor(
        private http: HttpClient
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
                    total: tour.total,
                    price: tour.price
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
                const { id, name, fromWhere, toWhere, description, fromDate, toDate, price, total } = tour;
                return { id, name, fromWhere, toWhere, description, fromDate, toDate, price, total };
            })
        )
    }
}