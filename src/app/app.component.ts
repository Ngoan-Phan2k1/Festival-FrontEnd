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
}
