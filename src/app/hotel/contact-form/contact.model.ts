import { Room } from "../hotel-room/room.model";

export class Contact {

    constructor(
        public id: number,
        public tourist_id: number,
        public fullname: string,
        public roomDTO: Room
    ) {}
}