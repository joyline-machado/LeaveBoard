import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

  opened = true;

  user = localStorage.getItem('Role');

  constructor(
    private authService : AuthService
  ){}

  handleLogout(){
    this.authService.logout();
  }

}
