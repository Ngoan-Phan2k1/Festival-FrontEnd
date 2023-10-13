import { Room } from "./hotel-room/room.model";
import { ImageDTO } from "./image.model";

export class Hotel {

    constructor(
        public id: number,
        public name: string,
        public location: string,
        public introduce: string,
        public services: string[],
        //public rooms: Room[],
        public imageDTO: ImageDTO,
        public url: string,
    ) {}
}