import { UserInfo } from "./user-info/userinfo.model";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({providedIn: "root"})
export class UserService {

    userChanged = new Subject<UserInfo>();
    fileChanged = new Subject<File>();
    private user: UserInfo;
    private file: File;

    setUser(user: UserInfo) {
        this.user = user;
        //this.rooms = this.hotel.rooms;
        this.userChanged.next(this.user);
        //console.log(this.recipes)
    }

    setFile(file: File) {
        this.file = file;
        this.fileChanged.next(this.file);
    }

    getUser() {
        return this.user;
    }


}