import {Component, HostListener} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from '@angular/router';
import {dateRangeValidator} from '../validators/date-range.validator';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  searchForm: FormGroup;
  roomGuestOptions = ['1 room, 1 guest', '1 room, 2 guests', '2 rooms, 3 guests', '2 rooms, 4 guests'];
  travelCards = [
    { title: 'Melbourne', description: 'An amazing journey', price: 700, imageUrl: './assets/melbourne.png'},
    { title: 'Paris', description: 'A Paris Adventure', price: 600, imageUrl: './assets/paris.png'},
    { title: 'London', description: 'London eye adventure', price: 350, imageUrl: './assets/london.png'},
    { title: 'Columbia', description: 'Amazing streets', price: 700, imageUrl: './assets/columbia.png'}
  ];

  constructor(private fb: FormBuilder, private router: Router) {
    this.searchForm = this.fb.group({
      destination: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      roomsGuests: ['1 room, 2 guests', Validators.required]
    },
    {
      validators: dateRangeValidator()
    });
  }

  onSubmit() {
    if (this.searchForm.valid) {
      this.router.navigate(['/property-list'], {
        state: {
          destination: this.searchForm.get('destination')?.value,
          checkIn: this.searchForm.get('checkIn')?.value,
          checkOut: this.searchForm.get('checkOut')?.value,
          roomsGuests: this.searchForm.get('roomsGuests')?.value
        }
      }).then(r => console.log('Navigation successful:', r));
    } else {
      console.log('Form is invalid');
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.pageYOffset > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }
}
