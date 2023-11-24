import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../tour/data-storage.service';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { UserInfo } from './user-info/userinfo.model';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  url = null;
  userData: User;
  isAuthenticated = false;

  userInfo: UserInfo;

  constructor(
    private userService: UserService,
    private dataService: DataStorageService,
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
    
    this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      if (this.isAuthenticated) {
        this.dataService.getTouristById(user?.touristId).subscribe(
          (user) => {
            this.userInfo = user;
            this.userService.setUser(user);

            if (user.imageDTO) {
              this.dataService.downloadImageByName(user?.imageDTO?.name).subscribe(
                (res) => {
                  this.url = res.url;
                }
              )
            }
            
          }
        )
      }
    })

  }

  onImageSelected(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {

      this.userService.setFile(fileList[0]);
      // Process the selected image here
      const selectedImage = fileList[0];
      // Display the selected image or upload it to a server
      this.url = URL.createObjectURL(selectedImage);
    }
  }

  logout() {
    this.authService.logout();
  }

}
