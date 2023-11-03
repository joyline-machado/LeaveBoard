import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common'
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.scss']
})
export class Login2Component {

  loginForm!: FormGroup;
  submitted: boolean = false;
  hide = true;
  message! : string;

  constructor(
    private auth: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, this.noSpaceAllowed]],
      password: ['', [Validators.required, this.noSpaceAllowed]],
    })

  }

  onLogin(loginForm : any){
    console.log(this.loginForm)
    this.submitted = true;
    if(this.loginForm.valid){
      let email = loginForm.value.email;
      let password = loginForm.value.password;
  
      // if(email == '') {
      //   alert('Please enter email');
      //   return;
      // }
      // if(password == '') {
      //   alert('Please enter password');
      //   return;
      // }
  
      this.auth.login(email, password).then(() => {
        this.message = this.auth.message
        this.snackBar.open(this.message, 'close', {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        })
      });
      
    }
   
    // email = '';
    // password = '';


  }

  noSpaceAllowed(control: AbstractControl): ValidationErrors | null {
    if (control.value != null && control.value.indexOf(' ') != -1) {
      return { noSapaceAllowed: true }
    }
    return null;
  }

  
}
