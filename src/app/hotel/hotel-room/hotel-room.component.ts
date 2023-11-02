import { Component, OnInit } from '@angular/core';
import { Room } from './room.model';
import { HotelService } from '../hotel.service';
import { ActivatedRoute, Params } from '@angular/router';
import { DataStorageService } from 'src/app/tour/data-storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel-room',
  templateUrl: './hotel-room.component.html',
  styleUrls: ['./hotel-room.component.scss']
})

export class HotelRoomComponent implements OnInit {

  rooms: Room[] = [];

  constructor(
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private dataService: DataStorageService
  ) {

  }

  ngOnInit(): void {

    // Swal.fire({
    //   title: 'Loading...',
    //   html: 'Please wait',
    //   allowOutsideClick: false, 
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });
    

    this.rooms = this.hotelService.getRooms();
    // console.log("ROOMS: ", this.rooms);
    this.route.params
    .subscribe(
      (params: Params) => {
        this.hotelService.roomsChanged.subscribe(
          (rooms: Room[]) => {
            this.rooms = rooms;
            for (const room of this.rooms) {
              this.dataService.downloadImageByName(room.imageDTO.name).subscribe(
                (res) => {
                  room.url = res.url;
                }
              )
            }
          }
        )
      }
    )

    //Swal.close()
  }
}
