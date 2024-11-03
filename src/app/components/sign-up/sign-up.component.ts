import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  paymentForm: FormGroup;

  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  currentStage = 'signUp';
  activationToken: string = '';

  images = ['assets/login-sign-up-4.jpg', 'assets/login-sign-up-1.jpg', 'assets/login-sign-up-2.jpg', "assets/login-sign-up-5.jpg"];
  currentImage = this.images[0];
  currentImageIndex = 0;
  dots = Array(this.images.length).fill(null);

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar) {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', Validators.required],
      expirationDate: ['', Validators.required],
      cvc: ['', Validators.required],
      nameOnCard: ['', Validators.required],
      countryOrRegion: ['', Validators.required],
      saveInfo: [true]
    });

    setInterval(() => {
      this.changeImage((this.currentImageIndex + 1) % this.images.length);
    }, 10000);
  }

  changeImage(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.images[index];
  }

  onSubmitSignUp() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      // this.currentStage = 'payment';
      this.loading = true;

      const customerCreationRequest = {
        firstName: this.signUpForm.controls['firstName'].value,
        lastName: this.signUpForm.controls['lastName'].value,
        email: this.signUpForm.controls['email'].value,
        phoneNumber: this.signUpForm.controls['phoneNumber'].value,
        password: this.signUpForm.controls['password'].value
      }

      this.authService.registerCustomer(customerCreationRequest).subscribe({
        next: (response) => {
          console.log('Customer created successfully:', response);
          this.currentStage = 'activate';
          this.loading = false;
          // Optionally show a message to check their email for the token.
        },
        error: (err) => {
          console.error('Error creating customer:', err);
          this.loading = false;
          // Handle error messages, e.g., email already taken.
        }
      });
    }
  }


  onSubmitActivation() {
    if (this.activationToken) {
      this.loading = true;

      // this.authService.activateCustomer(this.activationToken).subscribe({
      //   next: (response) => {
      //     console.log('Account activated successfully:', response);
      //     this.loading = false;
      //     // Navigate to another part of the app after successful activation
      //     this.router.navigate(['']);
      //   },
      //   error: (err) => {
      //     console.error('Error activating account:', err);
      //     this.loading = false;
      //     // Handle token invalid or other error messages
      //   }
      // });

      this.authService.activateCustomer(this.activationToken).subscribe(
        (response) => {
          this.loading = false;
          if (response.status) {
            console.log('Account activated successfully:', response);
            this.router.navigate(['']);
          } else {
            this.snackBar.open(response.message, 'Close', {
              duration: 3000,
            });
          }
        },
        (error) => {
          console.error('Error activating an account:', error);
          this.loading = false;
          this.snackBar.open('Unable to activate account. Please try again later.', 'Close', {
            duration: 3000,
          });
        }
      );
    }
  }

  onSubmitPayment() {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
    }
  }

  backToSignUp() {
    this.currentStage = 'signUp';
  }
}
