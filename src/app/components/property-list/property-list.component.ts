import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Property} from '../../models/model';
import {PropertyService} from '../../services/property/property.service';
import {dateRangeValidator} from '../validators/date-range.validator';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  roomGuestOptions = ['1 room, 1 guest', '1 room, 2 guests', '2 rooms, 3 guests', '2 rooms, 4 guests'];
  freebies = ['Free Breakfast', 'Free Parking', 'Free Internet', 'Free Shuttle', 'Free Cancellation'];
  ratings = [0, 1, 2, 3, 4];
  amenities: any[] = [];
  showMoreAmenities: boolean = false;
  selectedSortOption = 'recommended';
  showFilters: boolean = false;

  searchForm!: FormGroup;
  filtersForm!: FormGroup;

  properties: Property[] = [];
  filteredProperties: Property[] = [];

  constructor(private fb: FormBuilder, private propertyService: PropertyService) {
    // this.searchForm = this.fb.group({
    //     destination: ['', Validators.required],
    //     checkIn: ['', Validators.required],
    //     checkOut: ['', Validators.required],
    //     roomsGuests: ['', Validators.required]
    //   },
    //   {
    //     validators: dateRangeValidator()
    //   });

    this.filtersForm = this.fb.group({
      minValue: new FormControl(30),
      maxValue: new FormControl(500),
      rating: new FormControl(null),
      freebies: this.fb.array(this.freebies.map(() => new FormControl(false))),
      amenities: this.fb.array(this.amenities.map(() => new FormControl(false)))
    });
  }

  ngOnInit(): void {
    this.loadSearchForm();
    this.fetchProperties();
    this.fetchAmenities();
  }

  loadSearchForm() {
    this.searchForm = this.fb.group({
      destination: [history.state.destination, Validators.required],
      checkIn: [history.state.checkIn, Validators.required],
      checkOut: [history.state.checkOut, Validators.required],
      roomsGuests: [history.state.roomsGuests, Validators.required]
    },
    {
      validators: dateRangeValidator()
    });
  }

  fetchProperties() {
    this.propertyService.fetchProperties(this.searchForm.value).subscribe((data) => {
      this.properties = data;
      this.filteredProperties = data;
      console.log('Fetched Properties are:', this.properties);
      this.filterProperties();
      this.sortProperties();
    });
  }

  fetchAmenities() {
    this.propertyService.fetchAmenities().subscribe((data) => {
      this.amenities = data;
      // console.log('Fetched Amenities are:', data);
      this.initAmenitiesFiltersForm();
    });
  }

  initAmenitiesFiltersForm() {
    this.amenities.forEach(() => {
      this.amenitiesArray.push(new FormControl(false));
    });
  }

  sortProperties() {
    switch (this.selectedSortOption) {
      case 'price-low-to-high':
        this.filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-to-low':
        this.filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case 'recommended':
        this.filteredProperties.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this.filteredProperties.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  onSearchSubmit() {
    if (this.searchForm.valid) {
      console.log('Form Submitted', this.searchForm.value);
      this.fetchProperties();
    }
  }

  filterProperties() {
    const { minValue, maxValue, rating, freebies, amenities } = this.filtersForm.value;

    this.filteredProperties = this.properties.filter(property => {

      const matchesPrice = property.price >= minValue && property.price <= maxValue;

      const matchesRating = rating === null || property.rating >= rating;
      console.log('Rating:', rating, 'Property rating:', property.rating, 'Matches:', matchesRating);

      const selectedFreebies = freebies
        .map((checked: boolean, i: number) => (checked ? this.freebies[i] : null))
        .filter((v: any) => v !== null);
      const matchesFreebies = selectedFreebies.every((freebie: string) => property.freebies.includes(freebie));

      const selectedAmenities = amenities
        .map((checked: boolean, i: number) => (checked ? this.amenities[i] : null))
        .filter((v: any) => v !== null);
      const matchesAmenities = selectedAmenities.every((amenity: string) => property.amenities.includes(amenity));

      return matchesPrice && matchesRating && matchesFreebies && matchesAmenities;
    });
  }

  toggleRating(rating: number) {
    const currentRating = this.filtersForm.get('rating')?.value;

    if (currentRating === rating) {
      this.filtersForm.get('rating')?.setValue(null);
    } else {
      this.filtersForm.get('rating')?.setValue(rating);
    }

    this.filterProperties();
  }

  toggleShowMoreAmenities() {
    this.showMoreAmenities = !this.showMoreAmenities;
  }

  get freebiesArray(): FormArray {
    return this.filtersForm.controls['freebies'] as FormArray;
  }

  get amenitiesArray(): FormArray {
    return this.filtersForm.controls['amenities'] as FormArray;
  }

}
