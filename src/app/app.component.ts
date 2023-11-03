import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'LeaveBoard';

  isLoggedIn = false;

  ngOnInit(): void {
    if(localStorage.getItem('user')!== null) {
      this.isLoggedIn = true;
    }
    else{
      this.isLoggedIn = false;
    }
  }
}
