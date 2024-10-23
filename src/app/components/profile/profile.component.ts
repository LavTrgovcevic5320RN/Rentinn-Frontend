import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {EditDialogComponent} from '../edit-dialog/edit-dialog.component';
import {Booking, Customer} from '../../models/model';
import {BookingService} from '../../services/booking/booking.service';
import {UserService} from '../../services/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeTab = 'account';
  // activeTab = 'history';
  selectedSortOption = 'upcoming';

  selectTab(tab: string) {
    this.activeTab = tab;
  }

  fields = [
    { fieldName: 'name', label: 'Name' },
    { fieldName: 'email', label: 'Email' },
    { fieldName: 'password', label: 'Password' },
    { fieldName: 'phone', label: 'Phone Number' },
    { fieldName: 'address', label: 'Address' },
    { fieldName: 'dateOfBirth', label: 'Date of Birth' }
  ];

  constructor(public dialog: MatDialog,
              private bookingService: BookingService,
              private userService: UserService) {}

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

  customer: Customer | undefined
  bookings: Booking[] = [];

  ngOnInit() {
    this.fetchUser();
  }

  fetchUser() {
    this.userService.fetchLoggedInUser().subscribe(customer => {
      this.customer = customer;
      // console.log(this.customer);
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

}
