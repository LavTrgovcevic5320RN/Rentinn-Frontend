import {Component, HostListener, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Property} from '../../models/model';
import {PropertyService} from '../../services/property/property.service';
import {dateRangeValidator} from '../validators/date-range.validator';
import {ScrollService} from '../../services/scroll/scroll.service';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';

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

  properties!: Property[];
  filteredProperties!: Property[];

  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private scrollService: ScrollService,
              private router: Router
  ) {
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
    this.initScrollPosition();
  }

  initPropertyPrice() {
    this.filteredProperties.forEach(property => {
      const averagePrice = this.calculateAveragePriceForDates(property, this.searchForm.get('checkIn')?.value, this.searchForm.get('checkOut')?.value);
      property.averagePrice = averagePrice;
    });
  }

  loadSearchForm() {
    this.searchForm = this.fb.group({
        destination: ['', Validators.required],
        checkIn: ['', Validators.required],
        checkOut: ['', Validators.required],
        roomsGuests: ['1 room, 2 guests', Validators.required]
      },
      {
        validators: dateRangeValidator()
      });

    const savedForm = localStorage.getItem('searchForm');
    if (savedForm) {
      const parsedForm = JSON.parse(savedForm);
      this.searchForm.setValue({
        ...parsedForm,
        checkIn: parsedForm.checkIn ? new Date(parsedForm.checkIn) : '',
        checkOut: parsedForm.checkOut ? new Date(parsedForm.checkOut) : ''
      });
    }

  }

  fetchProperties() {
    this.propertyService.fetchProperties(this.searchForm.value).subscribe((data) => {
      this.properties = data;
      this.filteredProperties = data;
      console.log('Fetched Properties are:', this.properties);

      this.filteredProperties.forEach(property => {
        property.averagePrice = this.calculateAveragePriceForDates(property, this.searchForm.get('checkIn')?.value, this.searchForm.get('checkOut')?.value);
      });

      this.filterProperties();
      this.sortProperties();
    });
  }

  filterProperties() {
    const { minValue, maxValue, rating, freebies, amenities } = this.filtersForm.value;

    this.filteredProperties = this.properties.filter(property => {
      const matchesPrice = property.averagePrice >= minValue && property.averagePrice <= maxValue;

      const matchesRating = rating === null || property.rating >= rating;

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

  sortProperties() {
    switch (this.selectedSortOption) {
      case 'price-low-to-high':
        this.filteredProperties.sort((a, b) => a.averagePrice - b.averagePrice);
        break;
      case 'price-high-to-low':
        this.filteredProperties.sort((a, b) => b.averagePrice - a.averagePrice);
        break;
      case 'recommended':
        this.filteredProperties.sort((a, b) => b.rating - a.rating);
        break;
      default:
        this.filteredProperties.sort((a, b) => b.rating - a.rating);
        break;
    }
  }

  fetchAmenities() {
    this.propertyService.fetchAmenities().subscribe((data) => {
      this.amenities = data;
      this.initAmenitiesFiltersForm();
    });
  }

  initAmenitiesFiltersForm() {
    this.amenities.forEach(() => {
      this.amenitiesArray.push(new FormControl(false));
    });
  }

  onSearchSubmit() {
    if (this.searchForm.valid) {
      this.fetchProperties();
    }
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

  initScrollPosition() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const scrollPosition = this.scrollService.getScrollPosition();
        if (scrollPosition) {
          this.smoothScrollTo(scrollPosition, 1000);
        }
      });
  }

  smoothScrollTo(targetPosition: number, duration: number): void {
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const scrollStep = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const easeInOutQuad = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startPosition + distance * easeInOutQuad);

      if (elapsedTime < duration) {
        requestAnimationFrame(scrollStep);
      }
    };

    requestAnimationFrame(scrollStep);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    this.scrollService.setScrollPosition(window.scrollY);
  }

  viewProperty(property: Property) {
    console.log('Viewing property:', property);
    this.scrollService.setScrollPosition(window.scrollY);
    this.router.navigate(['/login'], { state: property }); // TEST
    // this.router.navigate(['/property', property.id], { state: { property } });
  }

}
