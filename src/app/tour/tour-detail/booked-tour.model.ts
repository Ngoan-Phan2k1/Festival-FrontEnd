export class BookedTour {
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
        public id: number,
        public booked: number,
        public phone: string,
        public tour: {
            id: number
        },
        public tourist: {
            id: number
        }
    ) {}
}