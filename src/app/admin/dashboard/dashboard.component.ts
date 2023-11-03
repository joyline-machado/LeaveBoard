import { Component } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  newHolidaysData!: Observable<any[]>;

  constructor( 
    private firestore: Firestore
    ) { 
      this.getHolidaysData();
    }

  getHolidaysData() {
    const collectionInstance = collection(this.firestore, 'Holidays');
    this.newHolidaysData = collectionData(collectionInstance, { idField: 'id' }).pipe(
      map((data: any[]) => {
        const currentDate = new Date();
        
        const filteredHolidays = data.filter((holiday) => {
          const holidayDate = holiday.holidayDate.toDate();
          return holidayDate >= currentDate;
        });
        return filteredHolidays.sort((a, b) => a.holidayDate.toDate() - b.holidayDate.toDate());
      })
      
    );
  }

}
