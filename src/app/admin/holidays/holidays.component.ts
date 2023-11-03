import { Component, TemplateRef } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/app/shared/data.service';
import { AddHolidayComponent } from './add-holiday/add-holiday.component';
import { Observable, map } from 'rxjs';
import { CalendarOptions, EventInput, } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent {

  isLoading : boolean = true;

  holidaysData!: Observable<any[]>;
  newHolidaysData!: Observable<any[]>;

  constructor(public dialog: MatDialog,
    private dataService: DataService,
    private firestore: Firestore
  ) { 
    this.getHolidaysData();
  }

  openDialog() {
    this.dialog.open(AddHolidayComponent, {
      width: '65%',
      height: '350px'
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    weekends: true,
    events: [], // Initialize events as an empty array
    eventContent: this.renderEventContent,
    // dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleDateClick.bind(this)
    // dateClick: (arg: DateClickArg) => this.handleDateClick(arg), 
  };
  eventsPromise!: Promise<EventInput>;


  handleDateClick(arg: any) {
    const clickedEvent = arg.event;
    // alert('date click! ' + arg.dateStr);

    const eventId = clickedEvent.extendedProps.eventId;
    // const selectedDate: Date = clickedEvent.event.date;
    const selectedDate: Date = new Date(clickedEvent.start);

    // const holidayId = clickedEvent.event.eventId;
  
    if (selectedDate) {
      const dialogRef = this.dialog.open(AddHolidayComponent, {
        width: '700px',
        height: '300px',

        data: { selectedDate, event: clickedEvent.event}
        
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
         
          
        }
      });



    }
  }

  renderEventContent(info: any) {
    const eventImage = info.event.extendedProps.image;
    const imageTag = eventImage ? `<img src="${eventImage}" class="event-image" />` : '';
    return `<div>${info.event.title}</div><div>${imageTag}</div>`;
    
  }

  getHolidaysData() {
    this.isLoading = true;
      const collectionInstance = collection(this.firestore, 'Holidays');
      collectionData(collectionInstance).subscribe(val => {
        // console.log(val);
        this.isLoading = false;
      })
      this.holidaysData = collectionData(collectionInstance, { idField: 'id'});
  
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
    
  
    
    this.holidaysData.subscribe(val => {
      const events = val.map(holiday => ({
        title: holiday.holidayOccasion,
        date: holiday.holidayDate.toDate(),
        allDay: true,
        backgroundColor: '#0097a7',
        borderColor: '#00796b',
        textColor: '#FFFFFF',
        extendedProps: {
          image: holiday.holidayImage 
        },
        image: holiday.holidayImage
      }));
      
      this.calendarOptions.events = events;
    });
    
  }

  onEventClick(clickedEvent: any) {
   
    const eventId = clickedEvent.extendedProps.eventId;
  
    if (eventId) {
      // this.router.navigate(['edit-holiday', eventId], { relativeTo: this.route });
      // this.openEditPopup(id)
    }
  }

  openEditPopup(id: string){
    const dialogRef = this.dialog.open(AddHolidayComponent, {
      width: '60%',
      height: '350px',
      data:  {id}
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Edited data:', result);
        
      }
      else {
        console.log({id})
      }
    });
  }

  deleteHoliday(id: string){
   this.dataService.deleteHoliday(id);
  }

  openDeleteDialog(ref: TemplateRef<any>, id: string) {
    this.dialog.open(ref, {
      data: { id }
    });
  }


}
