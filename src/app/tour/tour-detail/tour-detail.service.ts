import { EventEmitter, Injectable } from '@angular/core';
import { Tour } from '../tour.model'; 
import { Subject } from 'rxjs';

@Injectable({providedIn: "root"})
export class TourDetailService {
    tourdetailChanged = new Subject<Tour>();
    private tourDetail: Tour = null;

    setTourDetail(tourDetail: Tour) {
        this.tourDetail = tourDetail;
        this.tourdetailChanged.next(this.tourDetail);
        //console.log(this.recipes)
    }


}