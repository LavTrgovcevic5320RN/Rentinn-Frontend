import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PropertyService} from '../../services/property/property.service';
import {map, Subscription} from 'rxjs';
import {UserService} from '../../services/user/user.service';
import {Customer} from '../../models/model';
import {AuthService} from '../../services/auth/auth.service';
import * as L from 'leaflet';
import {icon} from 'leaflet';
import {HttpClient} from '@angular/common/http';

interface DailyPrice {
  date: string;
  price: number;
}

@Component({
  selector: 'app-add-and-edit-property',
  templateUrl: './add-and-edit-property.component.html',
  styleUrl: './add-and-edit-property.component.css'
})
export class AddAndEditPropertyComponent implements OnInit {
  customer: Customer = { id: 1, email: '', password: '', firstName: '', lastName: '', phoneNumber: '', address: '', dateOfBirth: new Date(), permissions: [], properties: [], favoriteProperties: [] };
  amenitiesList: string[] = [
    "24hr front desk", "air-conditioned", "fitness", "pool", "sauna", "spa", "bar", "restaurant", "wi-fi", "pet-friendly",
    "family rooms", "room service", "concierge service", "laundry service", "fitness center", "non-smoking rooms",
    "outdoor pool", "indoor pool", "business center", "conference rooms", "meeting facilities", "breakfast buffet",
    "private beach", "hot tub", "massage", "all-inclusive", "casino", "airport transfer", "elevator", "balcony/terrace",
    "kitchenette"
  ];
  freebiesList: string[] = [
    "Free Breakfast", "Free Parking", "Free Internet", "Free Shuttle Service", "Free Cancellation"
  ];
  authSubscription: Subscription | undefined;
  isLoggedIn: boolean = false;
  propertyForm: FormGroup;
  map: any;
  marker: any;
  displayedDailyPrices: DailyPrice[] = []; // Array to hold the displayed daily prices
// Array for time options in 24-hour format (hourly intervals)
  timeOptions: string[] = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);


  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private userService: UserService,
              private authService: AuthService,
              private http: HttpClient) {
    this.propertyForm = this.fb.group({
      ownerId: [null, Validators.required],
      title: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
      amenities: [[], Validators.required],
      freebies: [[], Validators.required],
      dailyPrices: this.fb.array([]),
      description: ['', Validators.required],
      highlights: this.fb.array([]),
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      selectedDateRange: this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required]
      }),
      selectedPrice: [0, [Validators.required, Validators.min(0)]],
      selectedImages: [null]
    });
    this.fetchLoggedInUser();
  }

  ngOnInit() {
    this.initializeMap();

    // Subscribe to changes in address, city, or country fields to re-geocode
    this.propertyForm.get('address')?.valueChanges.subscribe(() => this.updateMarkerLocation());
    this.propertyForm.get('city')?.valueChanges.subscribe(() => this.updateMarkerLocation());
    this.propertyForm.get('country')?.valueChanges.subscribe(() => this.updateMarkerLocation());
  }

  initializeMap() {
    this.map = L.map('map').setView([51.505, -0.09], 13);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   attribution: '© OpenStreetMap contributors'
    // }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(this.map);

    const materialIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<i class="material-icons">location_on</i>',
      // iconSize: [30, 42],
      iconAnchor: [12, 30]
    });

    this.marker = L.marker([51.505, -0.09], {
      draggable: true,
      icon: materialIcon,

    }).addTo(this.map);

    // Update latitude and longitude when the marker is dragged
    // this.marker.on('dragend', () => {
    //   const position = this.marker.getLatLng();
    //   this.propertyForm.get('latitude')?.setValue(position.lat);
    //   this.propertyForm.get('longitude')?.setValue(position.lng);
    //   console.log('Marker position:', position);
    // });

    // Update marker and form when map is clicked
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      this.marker.setLatLng([lat, lng]);
      this.propertyForm.get('latitude')?.setValue(lat);
      this.propertyForm.get('longitude')?.setValue(lng);
      console.log('Map clicked:', event.latlng);

    });
  }

  updateMarkerLocation() {
    const address = this.propertyForm.get('address')?.value;
    const city = this.propertyForm.get('city')?.value;
    const country = this.propertyForm.get('country')?.value;

    if (address && city && country) {
      const query = `${address}, ${city}, ${country}`;
      this.geocodeAddress(query).subscribe((coords) => {
        if (coords) {
          const { lat, lon } = coords;
          this.marker.setLatLng([lat, lon]); // Set the marker position
          this.map.setView([lat, lon], 13); // Center map to new location
          this.propertyForm.get('latitude')?.setValue(lat); // Update form fields
          this.propertyForm.get('longitude')?.setValue(lon);
        }
      });
    }
  }

  geocodeAddress(query: string) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results.length > 0) {
          return { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) };
        } else {
          return null;
        }
      })
    );
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

// Method to check for duplicate dates in the selected range
  private hasDateConflict(startDate: Date, endDate: Date): boolean {
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      if (this.displayedDailyPrices.some(price => price.date === dateString)) {
        return true; // Conflict found
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return false; // No conflict
  }

  // Add a new daily price entry if there are no duplicate dates
  addDailyPrice() {
    const startDate = new Date(this.propertyForm.get('selectedDateRange.start')?.value);
    const endDate = new Date(this.propertyForm.get('selectedDateRange.end')?.value);
    const price = this.propertyForm.get('selectedPrice')?.value;

    // Check if any dates in the range already exist in displayedDailyPrices
    if (this.hasDateConflict(startDate, endDate)) {
      alert("The selected date range overlaps with existing dates. Please select a different range.");
      return;
    }

    const expandedPrices: DailyPrice[] = [];
    let currentDate = startDate;

    // Expand date range to individual dates
    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split('T')[0];
      expandedPrices.push({ date: dateString, price: price });

      // Update date for next iteration
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Add expanded prices to display array and form array for backend submission
    this.displayedDailyPrices.push(...expandedPrices);
    const dailyPricesFormArray = this.propertyForm.get('dailyPrices') as FormArray;
    expandedPrices.forEach(dailyPrice => {
      dailyPricesFormArray.push(this.fb.group({
        date: [dailyPrice.date],
        price: [dailyPrice.price]
      }));
    });
  }

  removeDailyPrice(index: number) {
    this.displayedDailyPrices.splice(index, 1);
    const dailyPricesFormArray = this.propertyForm.get('dailyPrices') as FormArray;
    dailyPricesFormArray.removeAt(index);
  }

  // Helper to expand a date range into individual dates
  private expandDateRange(start: string, end: string, price: number) {
    const dateList = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      dateList.push({
        date: currentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        price: price
      });
      currentDate.setDate(currentDate.getDate() + 1); // Increment date by one day
    }
    return dateList;
  }

  onFileSelected(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.propertyForm.get('selectedImages')?.setValue(input.files);
    }
  }

  onSubmit() {
    this.propertyForm.get('ownerId')?.setValue(this.customer.id);

    if (this.propertyForm.valid) {
      const formData = new FormData();
      const formValue = { ...this.propertyForm.value };
      delete formValue.selectedImages;

      // Convert dailyPrices to a simple array with { date: "YYYY-MM-DD", price: number } format
      const dailyPricesFormArray = this.propertyForm.get('dailyPrices') as FormArray;
      formValue.dailyPrices = dailyPricesFormArray.controls.map(control => {
        return {
          date: control.get('date')?.value,
          price: control.get('price')?.value
        };
      });

      // Format Check-In and Check-Out times to "HH:mm"
      const checkInTime = this.propertyForm.get('checkIn')?.value;
      const checkOutTime = this.propertyForm.get('checkOut')?.value;

      formValue.checkIn = this.formatTime(checkInTime);
      formValue.checkOut = this.formatTime(checkOutTime);

      formData.append('property', new Blob([JSON.stringify(formValue)], { type: 'application/json' }));

      const files: FileList = this.propertyForm.get('selectedImages')?.value;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i], files[i].name);
        }
      }

      for(let property of formData.getAll('property')) {
        console.log(property);
      }

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

  // Helper function to ensure time is in "HH:mm" format
  private formatTime(time: string): string {
    if (time && time.includes(':')) {
      const [hours, minutes] = time.split(':').map(Number);
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    return time;
  }

}
