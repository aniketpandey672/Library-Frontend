import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  hidePwdContent: boolean = true;
  hidePwdContent2: boolean = true;
  registerForm: FormGroup;
  signupSuccess: boolean = false;
  emailExistsError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(20),
        Validators.pattern('^[A-Za-z]+$')  
      ]],
      lastName: ['', [
        Validators.maxLength(20), 
        Validators.pattern('^[A-Za-z]+$')  
      ]],
      email: ['', [
        Validators.required,
        (control: AbstractControl) => this.customEmailValidator(control) 
      ]],
      mobileNumber: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]{9}$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]],
      rpassword: [
        '',
        Validators.required
      ]
    }, { validators: this.passwordMatchValidator });
    };


    passwordMatchValidator(group: FormGroup) {
      const password = group.get('password');
      const confirmPassword = group.get('confirmPassword');
  
        if (password?.value !== confirmPassword?.value) {
          confirmPassword?.setErrors({ passwordMismatch: true });
        } else {
          confirmPassword?.setErrors(null);
        } 
        
    }

  register() {
    this.registerForm.markAllAsTouched();
    let user = {
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      email: this.registerForm.get('email')?.value,
      mobileNumber: this.registerForm.get('mobileNumber')?.value,
      password: this.registerForm.get('password')?.value,
    };
    this.apiService.register(user).subscribe({
      next: (res) => {
        this.snackBar.open(res, 'OK');
      },
   
    error: (error) => {
      this.signupSuccess = false;
      if (error.message === 'Email already exists') {
        this.emailExistsError = 'Email already exists';
      } else {
        this.emailExistsError = 'An error occurred during registration';
      }
    }
    });
  }
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get contact() {
    return this.registerForm.get('mobileNumber');
  }

  restrictSpecialCharacters(event: KeyboardEvent): void {
    const regex = /^[A-Za-z\s]*$/;
    const inputChar = String.fromCharCode(event.keyCode);
    if (
      ['Backspace', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)
    ) {
      return;
    }
    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }
  restrictSpecialCharacters2(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
  }
  customEmailValidator(control: AbstractControl): ValidationErrors | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|[a-zA-Z]{2,})$/;
    const isValid = emailPattern.test(control.value);
    return isValid ? null : { invalidEmail: true };
  }
}
