import { ImageDTO } from "src/app/hotel/image.model";

export class Schedule {
    constructor(
        public id: number,
        public tour_id: number,
        public day: number,
        public morning: string,
        public evening: string,
        public night: string,
        public imageDTO: ImageDTO,
        public url: string
    ) {}
}