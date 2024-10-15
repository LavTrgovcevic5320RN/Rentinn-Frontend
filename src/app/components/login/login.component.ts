import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  verifyCodeForm: FormGroup;
  setPasswordForm: FormGroup;

  hide = true;
  currentStage = 'login';

  images = ['assets/login-sign-up-1.jpg', 'assets/login-sign-up-2.png',
            'assets/login-sign-up-3.png', 'assets/login-sign-up-4.jpg'
  ];
  currentImage = this.images[0];
  currentImageIndex = 0;
  dots = Array(this.images.length).fill(null);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.verifyCodeForm = this.fb.group({
      code: ['', [Validators.required]],
    });

    this.setPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });


    setInterval(() => {
      this.changeImage((this.currentImageIndex + 1) % this.images.length);
    }, 10000);
  }

  changeImage(index: number) {
    this.currentImageIndex = index;
    this.currentImage = this.images[index];
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Handle login logic here
    }
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log(this.forgotPasswordForm.value);
      // Proceed to verification stage
      this.currentStage = 'verifyCode';
    }
  }

  onVerifyCodeSubmit() {
    if (this.verifyCodeForm.valid) {
      console.log(this.verifyCodeForm.value);
      // Proceed to set new password stage
      this.currentStage = 'setPassword';
    }
  }

  onSetPasswordSubmit() {
    if (this.setPasswordForm.valid) {
      console.log(this.setPasswordForm.value);
      // Handle password reset logic
    }
  }


  backToLogin() {
    this.currentStage = 'login';
  }
}
