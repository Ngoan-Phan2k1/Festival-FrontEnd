export class BookedTourResponse {
    // public id: number;
    // public name: string;
    // public fromWhere: string;
    // public toWhere: string;
    // public description: string;
    // public fromDate: string; 
    // public toDate: string;
    // public price: number;
    // public capacity: number;
    // public booked: number;

    constructor(
        public booked_id: number,
        public booked: number,
        public phone: string,
        public dateOfBooking: Date,
        public checkout: boolean,
        public tourDto: {
            id: number,
            name: string,
            fromWhere: string,
            toWhere: string,
            description: string,
            fromDate: string,
            toDate: string,
            price: number,
            capacity: number,
            booked: number
        }
    ) {}
}