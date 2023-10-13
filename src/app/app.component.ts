import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'festival-ui';

  // @HostListener('window:beforeunload', ['$event'])
  // unloadHandler(event: Event): void {
  //   // Xóa dữ liệu trong Local Storage khi trang web được làm mới
  //   localStorage.clear();
  // }

  onActivate(event) {
    // window.scroll(0,0);
 
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
 
     //or document.body.scrollTop = 0;
     //or document.querySelector('body').scrollTo(0,0)
  }
}
