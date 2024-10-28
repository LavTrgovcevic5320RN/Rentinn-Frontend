import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../../services/auth/auth.service';
import {UserService} from '../../services/user/user.service';
import {Customer, Property} from '../../models/model';
import {Router} from '@angular/router';
import {loadStripe, Stripe} from '@stripe/stripe-js';
import {HttpClient} from '@angular/common/http';
import {BookingService} from '../../services/booking/booking.service';

@Component({
  selector: 'app-renting',
  templateUrl: './renting.component.html',
  styleUrl: './renting.component.css'
})
export class RentingComponent implements OnInit, OnDestroy {
  stripePublishableKey = 'pk_test_51QDVkpGoH2c3s2KOoLcsoLUqK7esiu57TAhL45VqWvj7O3FGu22oU47NOXkUrd2T1Gn5Zy1wW7q4CM0Uct3akzJ2008SD3PCJN';
  paymentOptions = [
    { title: 'Pay with cash', description: 'Pay when you get to the property' },
    { title: 'Pay with credit card', description: 'Pay now and you are all set' }
  ];
  private authSubscription: Subscription | undefined;
  private stripe: Stripe | null = null;
  property!: Property;
  customer!: Customer;
  selectedOption: string = 'Pay with credit card';
  showCreditCard: boolean = true;
  isLoggedIn: boolean = false;
  parsedForm: any;


  constructor(private authService: AuthService,
              private userService: UserService,
              private bookingService: BookingService,
              private router: Router,
              private http: HttpClient) {}

  ngOnInit() {
    this.loadStripe();
    this.initialiseCustomer();
    this.property = history.state.property;
    console.log('Property:', this.property);

    const savedForm = localStorage.getItem('searchForm');
    if (savedForm) {
      this.parsedForm = JSON.parse(savedForm);
    }
  }

  async loadStripe() {
    this.stripe = await loadStripe(this.stripePublishableKey);
  }

  initialiseCustomer() {
    this.authSubscription = this.authService.getLoggedInStatus().subscribe(token => {
      this.isLoggedIn = !!token;

      if(this.isLoggedIn) {
        this.userService.fetchLoggedInUser().subscribe(customer => {
          this.customer = customer;
        });
      }
    });
  }

  // async handleConfirmBooking() {
  //   if (this.selectedOption === 'Pay with credit card') {
  //     this.bookingService.fetchStripeSession(this.customer.id, 26500, '/receipt', '/renting').subscribe((session: any) => {
  //       this.stripe?.redirectToCheckout({ sessionId: session.id });
  //       console.log('Session:', session);
  //     });
  //
  //   } else {
  //     await this.router.navigate(['/receipt']);
  //   }
  // }

  async handleConfirmBooking() {
    if (this.selectedOption === 'Pay with credit card') {
      console.log('Pay with credit card');
      // this.bookingService.fetchStripeSession(this.customer.email, this.property.averagePrice, '/receipt', '/renting').subscribe(async (session: any) => {
      //   const { error } = await this.stripe?.redirectToCheckout({ sessionId: session.id }) ?? {};
      //
      //   if (error) {
      //     console.error('Stripe Checkout Error:', error);
      //     // Handle Stripe checkout error if needed
      //   } else {
      //     // Payment session was successful, call backend to finalize booking
      //     console.log('Stripe Checkout Success:', session);
      //     this.finalizeBooking(session.id);
      //   }
      // });

      console.log("email:" + this.customer.email);
      console.log("averagePrice:" + this.property.averagePrice);
      console.log("propertyId:" + this.property.id);
      console.log("customerId:" + this.customer.id);
      console.log("checkIn:" + this.parsedForm.checkIn);
      console.log("checkOut:" + this.parsedForm.checkOut);


      this.bookingService.fetchStripeSession(this.customer.email, this.property.averagePrice, this.property.id, this.customer.id ,this.parsedForm.checkIn, this.parsedForm.checkOut, '/', '/renting'
      ).subscribe(async (session: any) => {
          const { error } = await this.stripe?.redirectToCheckout({
            sessionId: session.id
          }) ?? {};

          if (error) {
            console.error('Stripe Checkout Error:', error);
          }
        });

    } else {
      // await this.router.navigate(['/dsadada']);
      console.log('Pay with cash');
    }
  }

  // // Finalize booking by calling the backend API once payment is confirmed
  // finalizeBooking(sessionId: string) {
  //   this.bookingService.confirmBooking(this.customer.id, this.property.id, this.parsedForm.checkIn, this.parsedForm.checkOut, sessionId).subscribe({
  //     next: (response) => {
  //       console.log('Booking confirmed:', response);
  //       // this.router.navigate(['/receipt']);
  //     },
  //     error: (err) => {
  //       console.error('Error confirming booking:', err);
  //       // Handle error, show message to the user, etc.
  //     }
  //   });
  // }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  toggleCreditCard(show: boolean) {
    this.showCreditCard = show;
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

}
