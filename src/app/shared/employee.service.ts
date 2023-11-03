import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, updateDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { Leave } from './leave.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  leavesData!: Observable<any>;

  constructor(
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private angularFirestore : AngularFirestore
  ) { }

  applyLeave(leaveForm: any) {

    // leaveForm.value.status = 'pending';

    const collectionInstance= collection(this.firestore, 'Leaves');
    addDoc(collectionInstance, leaveForm.value).then(() => {
      // console.log('Data saved sucessfully');
      this.snackBar.open('Applied for leave', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
    })
    .catch((err) => {
      console.log(err);
    })
  }

  // get leaves data
  getLeavesData() {
    const collectionInstance= collection(this.firestore, 'leaves');
    collectionData(collectionInstance).subscribe(val => {
      console.log(val);
    })
    this.leavesData = collectionData(collectionInstance, { idField: 'id'});
   
  }

  // Delete leave
  deleteLeave(id: string){
    const docInstance = doc(this.firestore,'Leaves', id);
    deleteDoc(docInstance)
    .then(()=> {
      this.snackBar.open('Leave deleted', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'});
    })
  }

  getAllLeaves(): Observable<Leave[]> {
    let leavesRef = collection(this.firestore,'leaves')
    return collectionData(leavesRef, {idField: 'id'}) as Observable<Leave[]>
  }
  

  // Upadte leaves
  updateNote(leave: Leave, leaves: any){
    let docRef = doc(this.firestore, `leaves/{leave.id}`);
    return updateDoc(docRef, leaves)
   }
   

  getLeavesList(){
    
  }

  // Leaves
  getLeaveById(leaveId: string): Observable<any> {
    return this.angularFirestore.doc(`Leaves/${leaveId}`).valueChanges();
  }

  // Edit an item
  editLeave(leaveId: string, leave: any): Promise<void> {
    return this.angularFirestore.doc(`Leaves/${leaveId}`).update(leave);
    
  }
}
