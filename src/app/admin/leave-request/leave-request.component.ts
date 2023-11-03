import { AfterViewInit, Component, ViewChild, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Firestore, Query, collection, collectionData } from '@angular/fire/firestore';
import { Observable, combineLatest, map, of } from 'rxjs';
import { DataService } from 'src/app/shared/data.service';

interface LeaveData {
  id: string;
  leaveType: string;
  leaveReason: string;
  status: string;
  leaveFrom: Date;
  leaveTo: Date;
  userName: string
}

interface UserData {
  id: string;
  name: string;
  email: string,
  empID: string
}


@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit, AfterViewInit {

  isLoading: boolean = true;

  leavesData$!: Observable<any>;

  mergedData$!: Observable<UserData[]>;

  // dataSource = new MatTableDataSource<UserData>([]);

  displayedColumns: string[] = ['id', 'name', 'leaveType', 'leaveReason', 'leaveFrom','leaveTo', 'status'];
  // dataSource: MatTableDataSource<UserData>([]);
  // dataSource = new MatTableDataSource<UserData>([]);
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private firestore: Firestore,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    // this.getLeavesData()

    // const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));
    // console.log(users)
    // this.dataSource = new MatTableDataSource(users);

    // this.dataSource = new MatTableDataSource<UserData>;
    this.dataSource = new MatTableDataSource<UserData>;
    console.log("Constructor", this.dataSource)
  }

  ngOnInit(): void {
    this.getLeavesData()
    // this.dataSource = this.data;
  }


  ngAfterViewInit() {

    this.dataSource = new MatTableDataSource<UserData>([]);

    this.mergedData$.subscribe((data: UserData[]) => {
      this.leavesData$ = of(data);
      this.dataSource.data = data;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.changeDetectorRef.detectChanges();
      this.isLoading = false;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // getLeavesData() {
  // const collectionInstance= collection(this.firestore, 'Leaves');
  // collectionData(collectionInstance).subscribe(val => {
  //   console.log(val);
  // })
  // this.leavesData = collectionData(collectionInstance, { idField: 'id'});


  // }

  getLeavesData() {
    this.isLoading = true;
    const leavesQuery: Query<LeaveData> = collection(this.firestore, 'Leaves') as Query<LeaveData>;
    const usersQuery: Query<UserData> = collection(this.firestore, 'Users') as Query<UserData>;

    this.mergedData$ = combineLatest([
      collectionData<LeaveData>(leavesQuery, { idField: 'id' }),
      collectionData<UserData>(usersQuery),

    ]).pipe(
      map(([leaves, users]) => {

        return leaves.map(leave => {
          const user = users.find(user => user.email === leave.userName);
          if (user) {
            return {
              id: leave.id,
              name: user.name,
              email: user.email,
              empID: user.empID,
              leaveType: leave.leaveType,
              leaveReason: leave.leaveReason,
              status: leave.status,
              leaveFrom: leave.leaveFrom,
              leaveTo: leave.leaveTo,
            };
          } else {
            return null;
          }
        }).filter(data => data !== null) as UserData[];
      }));

    this.mergedData$.subscribe((data: UserData[]) => {

      this.leavesData$ = of(data);
      this.dataSource.data = data;
      // this.changeDetectorRef.detectChanges();
      this.isLoading = false;

    });
  }


  toggleStatus(row: any) {
    row.status = row.status === 'Approved' ? 'Pending' : 'Approved';
    this.dataService.updateItemStatus(row.id, row.status);
  }

}

/** Builds and returns a new User. */
function createNewUser(id: number): UserData {
  let name: string = '';
  let email: string = '';
  let empID: string = '';

  return {
    id: id.toString(),
    name: name,
    email: email,
    empID: empID
  };
}