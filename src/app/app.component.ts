import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Rentinn-Frontend';
  showNavbarAndFooter = true;

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
  }

  checkRoute() {
    const currentRoute = this.router.url;
    if (currentRoute === '/login' || currentRoute === '/sign-up')
      this.showNavbarAndFooter = false;
    else
      this.showNavbarAndFooter = true;

  }
}
