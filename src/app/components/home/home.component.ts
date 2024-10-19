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

    // const savedForm = localStorage.getItem('searchForm');
    // if (savedForm) {
    //   this.searchForm.setValue(JSON.parse(savedForm));
    // }
    //

    // this.searchForm.valueChanges.subscribe(formData => {
    //   localStorage.setItem('searchForm', JSON.stringify(formData));
    // });

    this.searchForm.valueChanges.subscribe(formData => {
      const formToSave = {
        ...formData,
        checkIn: formData.checkIn ? new Date(formData.checkIn).toString() : '',
        checkOut: formData.checkOut ? new Date(formData.checkOut).toString() : ''
      };
      localStorage.setItem('searchForm', JSON.stringify(formToSave));
    });

  }

  onSubmit() {
    if (this.searchForm.valid) {
      // this.router.navigate(['/property-list']).then(r => console.log('Navigation successful:', r));
      console.log('Form is valid');
      console.log(this.searchForm.value);
      this.router.navigate(['/property-list'], { state: this.searchForm.value }).then(r => console.log('Navigation successful:', r));
    } else {
      console.log('Form is invalid');
      // this.searchForm.markAllAsTouched();
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
