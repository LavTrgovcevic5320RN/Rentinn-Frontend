import { Component } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PropertyService} from '../../services/property/property.service';
import {Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {Customer} from '../../models/model';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-add-and-edit-property',
  templateUrl: './add-and-edit-property.component.html',
  styleUrl: './add-and-edit-property.component.css'
})
export class AddAndEditPropertyComponent {
  customer: Customer = { id: 1, email: '', password: '', firstName: '', lastName: '', phoneNumber: '', address: '', dateOfBirth: new Date(), permissions: [], properties: [], favoriteProperties: [] };
  private authSubscription: Subscription | undefined;
  isLoggedIn: boolean = false;
  propertyForm: FormGroup;

  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private userService: UserService,
              private authService: AuthService) {
    this.propertyForm = this.fb.group({
      ownerId: [null, Validators.required],
      title: [''],
      country: [''],
      city: [''],
      address: [''],
      postalCode: [''],
      latitude: [0],
      longitude: [0],
      imagePaths: this.fb.array([]),
      amenities: this.fb.array([]),
      freebies: this.fb.array([]),
      dailyPrices: this.fb.array([]),
      description: [''],
      highlights: this.fb.array([]),
      checkIn: [''],
      checkOut: [''],
      selectedImages: [null]
    });
    this.fetchLoggedInUser();
  }

  fetchLoggedInUser(): void {
    this.authSubscription = this.authService.getLoggedInStatus().subscribe(token => {
      this.isLoggedIn = !!token;
      if(this.isLoggedIn) {
        this.userService.fetchLoggedInUser().subscribe(customer => {
          this.customer = customer;
        });
      }
    });
  }

  get amenities() {
    return this.propertyForm.get('amenities') as FormArray;
  }

  get freebies() {
    return this.propertyForm.get('freebies') as FormArray;
  }

  get dailyPrices() {
    return this.propertyForm.get('dailyPrices') as FormArray;
  }

  get highlights() {
    return this.propertyForm.get('highlights') as FormArray;
  }

  addAmenity() {
    this.amenities.push(new FormControl(''));
  }

  addFreebie() {
    this.freebies.push(new FormControl(''));
  }

  addHighlight() {
    this.highlights.push(new FormControl(''));
  }

  addDailyPrice() {
    this.dailyPrices.push(
      this.fb.group({
        date: [''],
        price: [0]
      })
    );
  }

  removeDailyPrice(index: number) {
    this.dailyPrices.removeAt(index);
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.propertyForm.get('selectedImages')?.setValue(input.files);
      console.log('Selected images:', this.propertyForm.get('selectedImages')?.value);
    }
  }

  onSubmit() {
    this.propertyForm.get('ownerId')?.setValue(this.customer.id);

    if (this.propertyForm.valid) {
      const formData = new FormData();


      const formValue = { ...this.propertyForm.value };
      delete formValue.selectedImages;

      // Convert the form data (excluding files) to JSON and append it
      formData.append('property', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

      // Append each selected file under the 'images' key
      const files: FileList = this.propertyForm.get('selectedImages')?.value;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i], files[i].name);
        }
      }

      // Debugging: Log form data keys and values
      formData.forEach((value, key) => {
        console.log(`${key}:`, value);
      });

      // Call the property service to send form data to the backend
      this.propertyService.addProperty(formData).subscribe(
        response => {
          console.log('Property added successfully', response);
        },
        error => {
          console.error('Error adding property', error);
        }
      );

    } else {
      console.log('Form is not valid');
    }
  }
}
