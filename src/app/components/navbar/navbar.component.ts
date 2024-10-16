import {Component, OnDestroy, OnInit} from '@angular/core';
import { NavigationEnd, Router } from "@angular/router";
import {AuthService} from '../../services/auth/auth.service';
import {filter, Subscription} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isHomePage: boolean = false;
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkHomePage(event.urlAfterRedirects);
    });

    this.authSubscription = this.authService.getLoggedInStatus().subscribe(token => {
      this.isLoggedIn = !!token;
      this.checkHomePage(this.router.url);
    });
  }

  username = 'John Doe';
  userImage = 'https://via.placeholder.com/40';

  checkHomePage(url: string): void {
    this.isHomePage = url === '/' || url === '/home';
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
