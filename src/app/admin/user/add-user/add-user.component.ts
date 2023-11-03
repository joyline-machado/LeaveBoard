import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/shared/auth.service';
import { DataService } from 'src/app/shared/data.service';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  // standalone: true,
  // imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule],
})
export class AddUserComponent implements OnInit {

  isLoading: boolean = true;

  addEmployeeForm!: FormGroup;
  hide = true;
  submitted: boolean = false;
  userId!: string;
  message!: string;

  constructor(
    public dialogRef: MatDialogRef<AddUserComponent>,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private dataService: DataService,
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private fireAuth: AngularFireAuth,
    @Inject(MAT_DIALOG_DATA) public employee: any,
  ) {

  }

  ngOnInit(): void {
    this.addEmployeeForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9]*$")]],
      empID: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required, this.noFutureDate]],
      // role: ['', [Validators.required]],
      designation: ['', [Validators.required]]

    });

    console.log("This is from ngOnInit", this.employee)

    if (this.employee) {
      this.isLoading = true;
      this.userId = this.employee.id;
      // this.addEmployeeForm.patchValue(employee.user); // Populate form fields if editing

      this.dataService.getUserById(this.userId).subscribe((user) => {
        this.addEmployeeForm.patchValue({
          name: user.name,
          email: user.email,
          password: user.password,
          phone: user.phone,
          empID: user.empID,
          dateOfBirth: new Date(user.dateOfBirth.toDate()),
          designation: user.designation,
        });
      });

      this.isLoading = false;
    }
  }

  addEmployee(addEmployeeForm: any) {
    console.log(this.addEmployeeForm);
    this.submitted = true;

    if (this.addEmployeeForm.valid) {

      const email = addEmployeeForm.value.email;
      const password = addEmployeeForm.value.password;


      //  this.dataService.addUser(addEmployeeForm);

      this.fireAuth.createUserWithEmailAndPassword(email, password).then(() => {
        localStorage.setItem('token', 'true');
        // to store data to firestore
        const collectionInstance = collection(this.firestore, '/Users');
        addDoc(collectionInstance, addEmployeeForm.value);

        this.snackBar.open('Employee added successfully', 'close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        console.log('Data saved sucessfully');
        addEmployeeForm.reset()
        this.dialogRef.close();
        // this.router.navigate(['./user'])
      }, err => {
        // alert(err.message);
        if (err.message == 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).') {
          this.message = 'The email address is already in use by another account.'
        }
        // this.router.navigate(['./user'])
        return
      })


      // const collectionInstance = collection(this.firestore, '/Users');
      // // this.authService.register(email, password)


      // addDoc(collectionInstance, addEmployeeForm.value).then(() => {

      //   console.log('Data saved sucessfully');
      //   addEmployeeForm.reset()
      //   this.dialogRef.close();

      // })
      //   .catch((err) => {
      //     console.log(err);
      //   })

      // this.dialogRef.close();


    }
  }













  noFutureDate(control: AbstractControl): ValidationErrors | null {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { futureDate: true };
    }

    return null;
  }



  editEmployee() {
    this.submitted = true;
    if (this.addEmployeeForm.valid) {
      const formData = this.addEmployeeForm.value;

      const userId = this.employee.id;

      this.dataService.editUser(userId, formData).then(() => {
        this.dialogRef.close();
        this.snackBar.open('Updated employee details', 'close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });

      });

    }

  }


}
