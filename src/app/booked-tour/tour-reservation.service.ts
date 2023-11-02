// import { Injectable } from '@angular/core';
// import { BookedTourResponse } from './booked-tour-response.model';  
// import { Subject } from 'rxjs';

// @Injectable({providedIn: "root"})
// export class TourReservationService {
//     bookedtoursChanged = new Subject<BookedTourResponse[]>();
//     private bookedtours: BookedTourResponse[] = [];

//     setBookedTours(bookedtours: BookedTourResponse[]) {
//         this.bookedtours = bookedtours;
//         this.bookedtoursChanged.next(this.bookedtours.slice());
//     }
// }