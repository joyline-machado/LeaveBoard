import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from 'src/app/shared/employee.service';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-apply-leave',
  templateUrl: './apply-leave.component.html',
  styleUrls: ['./apply-leave.component.scss']
})
export class ApplyLeaveComponent implements OnInit{

  leaveForm!: FormGroup;
  loggedInUser: any;
  // matcher = new ApplyLeaveComponent();
  submitted: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ApplyLeaveComponent>,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public leaveReq: any,
  ) {

    const userData = localStorage.getItem('user');

    if (userData) {
      this.loggedInUser = JSON.parse(userData);
    }


   
  }

  ngOnInit(): void {
    this.leaveForm = this.formBuilder.group({
      leaveType: ['', [Validators.required]],
      leaveReason: ['', [Validators.required, Validators.minLength(5)]],
      leaveFrom: ['', [Validators.required]],
      leaveTo: ['', [Validators.required]],

    });
    
    if(this.leaveReq) {
      const leaveId = this.leaveReq.id;
      this.employeeService.getLeaveById(leaveId).subscribe((leave) => {
        this.leaveForm.patchValue({
          leaveType: leave.leaveType,
          leaveReason: leave.leaveReason,
          leaveFrom: new Date(leave.leaveFrom.toDate()), 
          leaveTo: new Date(leave.leaveTo.toDate()), 
        });
      });
    }
  }



  applyLeave(leaveForm: any) {

    this.submitted = true;
    if (leaveForm.valid) {
      leaveForm.value.status = 'Pending';
      leaveForm.value.userName = this.loggedInUser.email,

        this.employeeService.applyLeave(leaveForm);
      leaveForm.reset()
      this.dialogRef.close();
    }

  }

  editLeave() {
    this.submitted = true;
    if (this.leaveForm.valid) {
      const formData = this.leaveForm.value;

      const leaveId = this.leaveReq.id;

      this.employeeService.editLeave(leaveId, formData).then(() => {
        this.dialogRef.close(); 
        this.snackBar.open('Leave has been edited', 'close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'});
      });
        
    }
    
  }

}
