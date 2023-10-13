export class BookedTour {
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