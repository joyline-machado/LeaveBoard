import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore'
import { Employee } from '../model/employee';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Leave } from './leave.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private afs : AngularFirestore,
    private firestore: Firestore,
    private angularFirestore: AngularFirestore,
    private snackBar: MatSnackBar
    ) { }

  // Add Employee
  addUser(employee: Employee){
    employee.id = this.afs.createId();
    return this.afs.collection('/Users').add(employee);
  }

  // get all employee
  getAllUsers() {
    return this.afs.collection('/Users').snapshotChanges();
  }

  // delete employee
  deleteUser(employee: Employee){
    return this.afs.doc('/Users/'+employee.id).delete();
  }

  deleteEmp(id: string){
    const docInstance = doc(this.firestore,'/Users', id);
    deleteDoc(docInstance)
    .then(()=> {
      console.log('User Deleted');
      this.snackBar.open(' User deleted sucessfully', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
    }, err => {
      this.snackBar.open('Error while deleting User', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
      alert(err.message);
    })
  }

  // Update employee
  
  updateUser(userId: string, data: any): Promise<void> {
    return this.afs.doc(`/Users/${userId}`).update(data);
  }


  // Holidays
  addHoliday(addHolidayForm: any){
    const collectionInstance= collection(this.firestore, '/Holidays');
    addDoc(collectionInstance, addHolidayForm.value).then(() => {
      this.snackBar.open('Added Holiday sucessfully', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
    })
    .catch((err) => {
      this.snackBar.open(' Error while adding holidays', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
    })


  }

  // Delete Holiday
  deleteHoliday(id: string){
    const docInstance = doc(this.firestore,'/Holidays', id);
    deleteDoc(docInstance)
    .then(()=> {
      console.log('holiday Deleted')
      this.snackBar.open('Holiday deleted', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
    })
  }

   // Leave Request
   updateItemStatus(leaveId: string, newStatus: string) {
    return this.angularFirestore.doc(`Leaves/${leaveId}`).update({
      status: newStatus,
    });
  }

   // get single employee
   getUserById(userId: string): Observable<any> {
    return this.angularFirestore.doc(`Users/${userId}`).valueChanges();
    
  }

  // Edit an employee
  editUser(userId: string, data: any): Promise<void> {
    return this.angularFirestore.doc(`Users/${userId}`).update(data);
  }

  // Edit Holiday
  getHolidayById(holidayId: string): Observable<any> {
    return this.angularFirestore.doc(`Holidays/${holidayId}`).valueChanges();
  }

  editHoliday(holidayId: string, holiday: any): Promise<void> {
    return this.angularFirestore.doc(`Holidays/${holidayId}`).update(holiday);
  }


  getAllHolidays(): Observable<Leave[]> {
    let holidaysRef = collection(this.firestore,'Holidays')
    return collectionData(holidaysRef, {idField: 'id'}) as Observable<Leave[]>
  }

}
