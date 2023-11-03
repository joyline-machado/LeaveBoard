import { Component } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent {
  
  opened = false;
  loggedInUser: any;
  userData!: Observable<any>;
  loggedInUserName!: string; 

  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ){
    const userData = localStorage.getItem('user');
    if (userData) {
      this.loggedInUser = JSON.parse(userData);
    }

    this.getLoggedInUser()
  }

  getLoggedInUser(){
    let loggedInUserEmail = this.loggedInUser.email;
    const userCollection= collection(this.firestore, 'Users');
    
    const userQuery = query(userCollection, where('email', '==', loggedInUserEmail));

    this.userData = collectionData(userQuery, { idField: 'id' });

    this.userData.subscribe(users => {
      if (users.length > 0) {
         this.loggedInUserName = users[0].name;
      } else {
        console.log('User not found');
      }
    })
    


  }

  handleLogout(){
    this.authService.logout();
  }


}
