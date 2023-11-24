import { Room } from "src/app/hotel/hotel-room/room.model";
import { Tour } from "src/app/tour/tour.model";

export class OrderTour {
    constructor(
        public booked_id: number,
        public bookedAdult: number,
        public bookedChild: number,
        public bookedBaby: number,
        public fullname: string,
        public email: string,
        public address: string,
        public note: string,
        public num_room: number,
        public phone: string,
        public dateOfBooking: Date,
        public status: number,
        public tourDto: Tour,
        public roomDtO: Room,
        public checkout: boolean,
    ) {}
}