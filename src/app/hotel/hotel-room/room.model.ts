import { ImageDTO } from "../image.model";

export class Room {

    constructor(
        public id: number,
        public hotel_id: number,
        public name: string,
        public price: number,
        public services: string[],
        public imageDTO: ImageDTO,
        public url: string
    ) {}
}