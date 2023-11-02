import { ImageDTO } from "src/app/hotel/image.model";

export class UserInfo {

    constructor(
        public id: number,
        public fullname: string,
        public username: string,
        public email: string,
        public imageDTO: ImageDTO,
    ) {}
}