import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, Params } from '@angular/router';
import { DataStorageService } from 'src/app/tour/data-storage.service';
import { Hotel } from '../hotel.model';
import { HotelService } from '../hotel.service';
import { Observable } from 'rxjs';
import { Room } from '../hotel-room/room.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hotel-detail',
  templateUrl: './hotel-detail.component.html',
  styleUrls: ['./hotel-detail.component.scss']
})
export class HotelDetailComponent implements OnInit {
  isTquanActive = true;
  isRoomActive = false;
  roomId: number;
  hotel_id: number;
  hotel: Hotel;
  images: [];

  constructor(
    private hotelService: HotelService,
    private dataService: DataStorageService,
    private router: Router,
    private route: ActivatedRoute,
  ) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    // Swal.fire({
    //   title: 'Loading...',
    //   html: 'Please wait',
    //   allowOutsideClick: false, 
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });

    this.route.params
    .subscribe(
      (params: Params) => {

        Swal.fire({
          title: 'Loading...',
          html: 'Please wait',
          allowOutsideClick: false, 
          didOpen: () => {
            Swal.showLoading()
          }
        });
        
        this.hotel_id = +params['id'];
        this.dataService.getHotelById(this.hotel_id).subscribe(
          (data) => {
            this.hotel = data;
            this.hotelService.setHotel(this.hotel);
            this.dataService.downloadImageByName(this.hotel.imageDTO.name).subscribe(
              (res) => {
                this.hotel.url = res.url;
                this.hotelService.setHotel(this.hotel);
              }
            )
          }
        )

        this.dataService.getRoomByHotelId(this.hotel_id).subscribe(
          (rooms: Room[]) => {
            for (const room of rooms) {
              this.dataService.downloadImageByName(room.imageDTO.name).subscribe(
                (res) => {
                  room.url = res.url;
                }
              )
            }
            this.hotelService.setRooms(rooms);
          }
        )
        
        Swal.close();
      }
    )
    //Swal.close()
  }

  // isActive(route: string): boolean {
  //   return this.router.isActive(route, true);
  // }

  // checkCurrentRoute() {


    

  //   const currentRoute = this.router.url;

  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationEnd) {
  //       // this.checkCurrentRoute(event.urlAfterRedirects);
  //       const url = event.urlAfterRedirects;
  //       if (url === '/hotel/detail') {
  //         this.tquan = true;
  //         this.ctiet = false;
  //       }
  //       else if (url === '/hotel/detail/room') {
  //         this.tquan = false;
  //         this.ctiet = true;
  //       }
        
  //     }
  //   });

  //   console.log("Tquan: ", this.tquan);
  //   console.log("Ctiet: ", this.ctiet);


  //   //console.log(currentRoute);
    
  // }

  navigateToRoom() {
    this.isRoomActive = true;
    this.isTquanActive = false;
    this.router.navigate(['room'], {relativeTo: this.route});
  }

  
  navigateToTquan() {
    this.isRoomActive = false;
    this.isTquanActive = true;
    this.router.navigate(['../', this.hotel_id], {relativeTo: this.route});

  }

}
