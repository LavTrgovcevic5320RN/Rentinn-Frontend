// import {Component, HostListener, OnInit} from '@angular/core';
// import {NavigationEnd, Router, RouterLink} from "@angular/router";
//
// @Component({
//   selector: 'app-navbar',
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent implements OnInit {
//   isHomePage: boolean = false;
//
//   constructor(private router: Router) {}
//
//   ngOnInit(): void {
//     // Listen to route changes
//     this.router.events.subscribe(event => {
//       if (event instanceof NavigationEnd) {
//         // Check if the current route is the home page
//         this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
//       }
//     });
//   }
//
// }




import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isHomePage: boolean = false;
  isLoggedIn: boolean = false; // Track if the user is logged in

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home';
      }
    });

    // this.isLoggedIn = !!localStorage.getItem('authToken'); // Example of checking if a token exists
  }

  login(): void {
    localStorage.setItem('authToken', 'example_token');
    this.isLoggedIn = true;
  }

  username = 'John Doe';
  userImage = 'https://via.placeholder.com/40'; // URL slike korisnika

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
  }
}
