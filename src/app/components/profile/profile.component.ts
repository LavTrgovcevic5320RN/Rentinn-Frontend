import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {EditDialogComponent} from '../edit-dialog/edit-dialog.component';
import {Booking, Customer, Property} from '../../models/model';
import {BookingService} from '../../services/booking/booking.service';
import {UserService} from '../../services/user/user.service';
import {PropertyService} from '../../services/property/property.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {dateRangeValidator} from '../validators/date-range.validator';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  fields = [
    { fieldName: 'name', label: 'Name' },
    { fieldName: 'email', label: 'Email' },
    { fieldName: 'password', label: 'Password' },
    { fieldName: 'phone', label: 'Phone Number' },
    { fieldName: 'address', label: 'Address' },
    { fieldName: 'dateOfBirth', label: 'Date of Birth' }
  ];
  favoriteProperties: { [id: number]: boolean } = {};
  customer: Customer = { id: 1, email: '', password: '', firstName: '', lastName: '', phoneNumber: '', address: '', dateOfBirth: new Date(), permissions: [], properties: [], favoriteProperties: [] };
  bookings: Booking[] = [];
  properties!: Property[];
  filteredProperties!: Property[];
  activeTab = 'account';
  // activeTab = 'history';
  selectedSortOption = 'upcoming';

  constructor(public dialog: MatDialog, private router: Router, private bookingService: BookingService,
              private userService: UserService, private propertyService: PropertyService) {}

  ngOnInit() {
    this.fetchUser();
    this.fetchProperties();
  }

  fetchUser() {
    this.userService.fetchLoggedInUser().subscribe(customer => {
      this.customer = customer;
      console.log(this.customer);
      this.favoriteProperties = customer.favoriteProperties.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {} as { [id: number]: boolean });
      this.fetchBookings();
    });
  }

  fetchBookings() {
    this.bookingService.fetchBookings(this.customer!.id).subscribe((data) => {
      this.bookings = data;
      console.log('Fetched Bookings are:', this.bookings);
      this.sortProperties();
    });
  }

  fetchProperties() {
    // this.propertyService.fetchAllProperties().subscribe((data) => {
    //   this.properties = data;
    //   this.filteredProperties = data;
    //
    //   // this.filteredProperties.forEach(property => {
    //   //   property.averagePrice = this.calculateAveragePriceForDates(property, this.searchForm.get('checkIn')?.value, this.searchForm.get('checkOut')?.value);
    //   // });
    //
    // });
  }

  calculateAveragePriceForDates(property: Property, checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const relevantPrices = property.dailyPrices.filter(dailyPrice => {
      const priceDate = new Date(dailyPrice.date);
      return priceDate >= checkInDate && priceDate <= checkOutDate;
    });

    if (relevantPrices.length === 0) {
      return 0;
    }

    const total = relevantPrices.reduce((acc, dailyPrice) => acc + dailyPrice.price, 0);
    return total / relevantPrices.length;
  }

  viewProperty(property: Property) {
    // console.log('Viewing property:', property);
    localStorage.setItem('selectedPropertyId', property.id.toString());
    this.router.navigate(['/property']);
  }

  onFavoriteClick(propertyId: number) {
    this.favoriteProperties[propertyId] = !this.favoriteProperties[propertyId];
    this.userService.editFavoriteProperties(this.customer.id, propertyId, this.favoriteProperties[propertyId]).subscribe(() => {
      console.log('Customer edited his favorite properties!');
    });
  }



  openEditDialog(field: string, value: string): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '300px',
      data: { field, value }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result !== value) {
        switch (field) {
          case 'name':
            this.customer!.firstName = result.split(' ')[0]; // Assuming name format is "First Last"
            this.customer!.lastName = result.split(' ')[1] || '';
            break;
          case 'email':
            this.customer!.email = result;
            break;
          case 'password':
            this.customer!.password = result;
            break;
          case 'phone':
            this.customer!.phoneNumber = result;
            break;
          case 'address':
            this.customer!.address = result;
            break;
          case 'dateOfBirth':
            this.customer!.dateOfBirth = new Date(result);
            break;
          default:
            break;
        }

        this.userService.updateCustomer(this.customer!).subscribe((data) => {
          console.log('Updated customer:', data);
        });
      }
    });
    console.log('Open dialog for editing', field);
  }

  sortProperties() {
    switch (this.selectedSortOption) {
      case 'price-low-to-high':
        this.bookings.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case 'price-high-to-low':
        this.bookings.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case 'upcoming':
        this.bookings.sort((a, b) => new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime());
        break;
      default:
        this.bookings.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
    }
  }

  selectTab(tab: string) {
    this.activeTab = tab;
  }


}
