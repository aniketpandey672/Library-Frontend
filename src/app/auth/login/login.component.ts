import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;
  responseMessage: string = '';

  constructor(
    fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = fb.group({
      email: ['', [
        Validators.required,
        (control: AbstractControl) => this.customEmailValidator(control) 
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]]
    });
  }
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|[a-zA-Z]{2,})$/;
    const isValid = emailPattern.test(control.value);
    return isValid ? null : { invalidEmail: true };
  }
  login() {
    this.loginForm.markAllAsTouched();
    let loginInfo = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
    };
    this.apiService.login(loginInfo).subscribe({
      next: (res) => {
        if (res == 'not found')
          this.snackBar.open('Credential are invalid!', 'OK');
        else if (res == 'unapproved')
          this.snackBar.open('Your account is not Aprooved by Admin!', 'OK');
          else if (res == 'blocked')
          this.snackBar.open('Your account is BLOCKED. Please go to admin office to Unblock.', 'OK');
        else {
          localStorage.setItem('access_token', res);
          this.apiService.userStatus.next("loggedIn");
        }
      },
      error: (error) => {
        if (error.status === 401) {
          if (this.loginForm.get('email')?.value) {
            this.responseMessage = 'Incorrect password. Please try again.';
            setTimeout(() => {
              this.responseMessage = '';
            }, 2000);
          } else {
            this.responseMessage = 'This email is not registered. Please sign up.';
          }
        } else {
          this.responseMessage = 'Login failed. Please try again.';
        }
      }
    });
  }
}
