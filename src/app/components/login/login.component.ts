import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  forgotPasswordForm: FormGroup;
  verifyCodeForm: FormGroup;
  setPasswordForm: FormGroup;

  hide = true;
  loading = false;
  currentStage = 'login';

  images = ['assets/login-sign-up-4.jpg', 'assets/login-sign-up-1.jpg', 'assets/login-sign-up-2.jpg', "assets/login-sign-up-5.jpg"];
  currentImage = this.images[0];
  currentImageIndex = 0;
  dots = Array(this.images.length).fill(null);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const redirectUrl = localStorage.getItem('redirectUrl') || '/';
      localStorage.removeItem('redirectUrl'); // Clear the stored URL after using it
      this.router.navigate([redirectUrl]);
    }
  }

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute) {

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
      this.login();
    }
  }

  login() {
    this.loading = true;
    console.log(this.loginForm.controls['email'].value);
    console.log(this.loginForm.controls['password'].value);

    if(this.router.url.includes('employee')) {
      console.log("Employee login");
      this.authService.loginEmployee(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe(
        (token) => {
          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          localStorage.removeItem('redirectUrl'); // Clear the stored URL after using it
          this.router.navigate([redirectUrl]);
          this.loading = false;
        },
        error => {
          // this.popupService.openPopup("Error", "Wrong email or password")
          // this.alertService.error(error);
          this.loading = false;
        });

    } else {
      console.log("Customer login");
      this.authService.loginCustomer(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value, this.loginForm.controls['rememberMe'].value).subscribe(
        (token) => {
          const redirectUrl = localStorage.getItem('redirectUrl') || '/';
          localStorage.removeItem('redirectUrl'); // Clear the stored URL after using it
          this.router.navigate([redirectUrl]);
          this.loading = false;
        },
        error => {
          // this.popupService.openPopup("Error", "Wrong email or password")
          // this.alertService.error(error);
          this.loading = false;
        });
    }
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log(this.forgotPasswordForm.value);
      this.currentStage = 'verifyCode';
    }
  }

  onVerifyCodeSubmit() {
    if (this.verifyCodeForm.valid) {
      console.log(this.verifyCodeForm.value);
      this.currentStage = 'setPassword';
    }
  }

  onSetPasswordSubmit() {
    if (this.setPasswordForm.valid) {
      console.log(this.setPasswordForm.value);

    }
  }


  backToLogin() {
    this.currentStage = 'login';
  }
}
