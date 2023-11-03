import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = false;
  message!: string;

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  // Login method
  async login(email: string, password: string) {
    await this.fireAuth.signInWithEmailAndPassword(email, password).then((res) => {
      // localStorage.setItem('token', 'Token');
      this.isLoggedIn = true;
      localStorage.setItem('user', JSON.stringify(res.user))
      this.snackBar.open('Logged-in successful', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })
      if (email == 'admin@pacewisdom.com' && password == 'admin@123') {
        localStorage.setItem('Role', 'ADMIN');
        this.router.navigate(['']);
      }
      else {
        localStorage.setItem('Role', 'EMPLOYEE');
        this.router.navigate([''])
      }
    }, err => {
      // alert(err.message);
      // console.log(err.message);
      if (err.message == 'Firebase: Error (auth/invalid-login-credentials).'){
        this.message = 'Invalid Login Credentials, Please Try Again ...'
      }

      if (err.message == 'Firebase: Error (auth/too-many-requests).'){
        this.message = 'Something went wrong, Please Try Again Later...'
      }
      
      this.snackBar.open(this.message, 'close', {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      })

      // console.log(this.message)

      this.router.navigate(['/login'])
      return this.message
    })
  }

  // register method
  register(email: string, password: string) {
    this.fireAuth.createUserWithEmailAndPassword(email, password).then(() => {
      localStorage.setItem('token', 'true');
      this.snackBar.open('Employee added successfully', 'close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
      this.router.navigate(['./user'])
    }, err => {
      // alert(err.message);
      if (err.message == 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).'){
        this.message = 'The email address is already in use by another account.'
      }
      // this.router.navigate(['./user'])
      return
    })
  }

  // signout
  logout() {
    this.fireAuth.signOut().then(() => {
      this.router.navigate(['login'])
      localStorage.removeItem('user');
      localStorage.removeItem('Role');
      
    }, err => {
      alert(err.message);
    })
  }


}
