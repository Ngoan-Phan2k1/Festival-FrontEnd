import { Hotel } from "../hotel/hotel.model";
import { ImageDTO } from "../hotel/image.model";

export class Tour {

    constructor(
        public id: number,
        public festival_id: number,
        public name: string,
        public fromWhere: string,
        public toWhere: string,
        public description: string,
        public fromDate: string,
        public toDate: string,
        public priceAdult: number,
        public priceChild: number,
        public priceBaby: number,
        public capacity: number,
        public booked: number,
        public canbook: number,
        public imageDTO: ImageDTO,
        public hotelDTOs: Hotel[],
        public url: string
    ) {}
}