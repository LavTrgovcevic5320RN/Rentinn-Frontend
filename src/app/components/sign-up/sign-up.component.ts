import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  paymentForm: FormGroup;

  hide = true;
  currentStage = 'signUp'; // Default stage

  images = ['assets/hotel pool login.png', 'assets/airplane login.png', 'assets/login 3.jpg'];
  currentImage = this.images[0];
  currentImageIndex = 0;
  dots = Array(this.images.length).fill(null);

  constructor(private fb: FormBuilder) {
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

    // Automatically change image every few seconds
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
      // Move to payment method stage
      this.currentStage = 'payment';
    }
  }

  onSubmitPayment() {
    if (this.paymentForm.valid) {
      console.log(this.paymentForm.value);
      // Complete the sign-up process and handle payment information
    }
  }

  backToSignUp() {
    this.currentStage = 'signUp';
  }
}
