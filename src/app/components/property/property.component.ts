import {Component, OnInit} from '@angular/core';
import {Image} from '@failed-successfully/ngx-darkbox-gallery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import {Booking, Property} from '../../models/model';
import * as L from 'leaflet';
import {PropertyService} from '../../services/property/property.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {dateRangeValidator} from '../validators/date-range.validator';
import {BookingService} from '../../services/booking/booking.service';
import {MatDialog} from '@angular/material/dialog';
import {ReviewDialogComponent} from '../review-dialog/review-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {StorageService} from '../../services/storage/storage.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrl: './property.component.css'
})
export class PropertyComponent implements OnInit {
  property: Property = { id: 0, title: '', country: '', city: '', address: '', postalCode: '', latitude: 0, longitude: 0, imagePaths: [], amenities: [], freebies: [], rating: 0, averagePrice: 0, dailyPrices: [], description: '', highlights: [], reviews: [], checkIn: '', checkOut: '', totalPrice: 0 };
  amenitiesIcons: { [key: string]: string } = {
    '24hr front desk': 'support_agent',
    'air-conditioned': 'ac_unit',
    'fitness': 'fitness_center',
    'pool': 'pool',
    'sauna': 'spa',
    'spa': 'spa',
    'bar': 'local_bar',
    'restaurant': 'restaurant',
    'wi-fi': 'wifi',
    'pet-friendly': 'pets',
    'family rooms': 'family_restroom',
    'room service': 'room_service',
    'concierge service': 'support_agent',
    'laundry service': 'local_laundry_service',
    'fitness center': 'fitness_center',
    'non-smoking rooms': 'smoke_free',
    'outdoor pool': 'pool',
    'indoor pool': 'pool',
    'business center': 'business',
    'conference rooms': 'meeting_room',
    'meeting facilities': 'meeting_room',
    'breakfast buffet': 'free_breakfast',
    'private beach': 'beach_access',
    'hot tub': 'hot_tub',
    'massage': 'self_improvement',
    'all-inclusive': 'all_inclusive',
    'casino': 'casino',
    'airport transfer': 'airport_shuttle',
    'elevator': 'elevator',
    'balcony/terrace': 'balcony',
    'kitchenette': 'kitchen'
  };
  lightbox: PhotoSwipeLightbox | undefined;
  visibleImages: Image[] = [];
  images: Image[] = [];
  visibleAmenitiesCount = 8;
  initialVisibleCount = 5;
  reviewsPerPage = 2;
  currentPage = 1;
  showAllAmenities = false;
  isFavorited = false;
  map: any;
  searchForm: FormGroup;
  unavailableDates: Set<string> = new Set();

  constructor(private fb: FormBuilder,
              private propertyService: PropertyService,
              private bookingService: BookingService,
              private storageService: StorageService,
              private router: Router,
              public dialog: MatDialog,
              private snackBar: MatSnackBar) {
    this.searchForm = this.fb.group({
        destination: ['', Validators.required],
        checkIn: ['', Validators.required],
        checkOut: ['', Validators.required],
        roomsGuests: ['1 room, 2 guests', Validators.required]
      },
      {
        validators: dateRangeValidator()
      });

    this.storageService.formState$.subscribe((form) => {
      if (form) {
        this.searchForm = form;
      }
    });

    this.searchForm.valueChanges.subscribe((value) => {
      if (!this.storageService['isProgrammaticUpdate']) {
        this.storageService.updateForm(value);
        this.loadPrices();

      }
    });
  }

  ngOnInit(): void {
    const propertyId = localStorage.getItem('selectedPropertyId') ? JSON.parse(localStorage.getItem('selectedPropertyId') || '{}') : {};
    this.fetchProperty(propertyId);
  }

  fetchProperty(propertyId: any) {
    this.propertyService.fetchProperty(propertyId).subscribe(property => {
      this.property = property;
      this.loadPrices()
      this.initializeVisibleImages();
      this.initPhotoSwipe();
      this.configMap();
      this.loadBookedDates();
      // console.log('Property:', this.property);
    });
  }

  loadPrices() {
    this.property.averagePrice = this.calculateAveragePriceForDates(this.property, this.searchForm.get('checkIn')?.value, this.searchForm.get('checkOut')?.value);
    this.property.totalPrice = this.calculateTotalPriceForDates(this.property, this.searchForm.get('checkIn')?.value, this.searchForm.get('checkOut')?.value);
  }

  initializeVisibleImages(): void {
    this.images = this.property.imagePaths.map(imagePath => ({
      url: imagePath,
      thumbnailUrl: imagePath
    }));

    this.visibleImages = this.images.slice(0, this.initialVisibleCount);
  }

  initPhotoSwipe(): void {
    this.lightbox = new PhotoSwipeLightbox({
      showHideAnimationType: 'none',
      pswpModule: PhotoSwipe,
      preload: [1, 2],
      wheelToZoom: true,
      padding: { top: 20, bottom: 40, left: 100, right: 100 },
      closeTitle: 'Close the dialog',
      zoomTitle: 'Zoom the photo',
      arrowPrevTitle: 'Go to the previous photo',
      arrowNextTitle: 'Go to the next photo',
      errorMsg: 'The photo cannot be loaded',
    });

    this.lightbox.addFilter('numItems', () => {
      return this.images.length;
    });

    this.lightbox.addFilter('itemData', (itemData, index) => {
      const image = this.images[index];
      return {
        src: image.url,
        width: 3500,
        height: 2000
      };
    });

    this.lightbox.init();
  }

  openGalleryFromIndex(index: number): void {
    if (this.lightbox) {
      this.lightbox.loadAndOpen(index);
    }
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

  calculateTotalPriceForDates(property: Property, checkIn: string, checkOut: string): number {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const relevantPrices = property.dailyPrices.filter(dailyPrice => {
      const priceDate = new Date(dailyPrice.date);
      return priceDate >= checkInDate && priceDate <= checkOutDate;
    });

    if (relevantPrices.length === 0) {
      return 0;
    }

    return relevantPrices.reduce((acc, dailyPrice) => acc + dailyPrice.price, 0);
  }

  getAmenityIcon(amenity: string): string {
    return this.amenitiesIcons[amenity as keyof typeof this.amenitiesIcons] || 'help_outline';
  }

  showMoreAmenities(): void {
    this.showAllAmenities = true;
  }

  get visibleAmenities(): string[] {
    if (this.showAllAmenities) {
      return this.property.amenities;
    }
    return this.property.amenities.slice(0, this.visibleAmenitiesCount);
  }

  get remainingAmenitiesCount(): number {
    return this.property.amenities.length - this.visibleAmenitiesCount;
  }

  configMap() {
    this.map = L.map('map', {
      center: [this.property.latitude, this.property.longitude],
      zoom: 15,
    });

    // L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //   // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(this.map);

    // L.tileLayer('https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token=ja1B5S4XzIDJzjp1DwVuSNsspOQQJ8fPntS3XFjLPEFxcpqUMIVF7xh0ynBBk8To', {
    // L.tileLayer('https://tile.jawg.io/bf9173a7-30f9-429d-b8f4-7a755d5b88a8/{z}/{x}/{y}{r}.png?access-token=ja1B5S4XzIDJzjp1DwVuSNsspOQQJ8fPntS3XFjLPEFxcpqUMIVF7xh0ynBBk8To', {
    //   attribution: '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   maxZoom: 22,
    //   subdomains: 'abcd'
    // }).addTo(this.map);

    // L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    //   attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    //   subdomains: 'abcd',
    //   maxZoom: 20
    // }).addTo(this.map);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
    }).addTo(this.map);

    const materialIcon = L.divIcon({
      className: 'custom-div-icon',
      html: '<i class="material-icons">location_on</i>',
      iconSize: [30, 42],
      iconAnchor: [0, 0]
    });

    L.marker([this.property.latitude, this.property.longitude], { icon: materialIcon }).addTo(this.map)
      // .bindPopup(`<b>${property.name}</b><br>${property.location}`)
      .openPopup();
  }

  onFavoriteClick() {
    this.isFavorited = !this.isFavorited;
    if (this.isFavorited) {
      console.log('Hotel added to favorites!');
    } else {
      console.log('Hotel removed from favorites!');
    }
  }

  onShareClick() {
    const shareUrl = window.location.href;
    console.log('Sharing hotel:', shareUrl);
  }

  checkUserCanLeaveReview(): void {
    this.bookingService.canLeaveReview(this.property.id).subscribe(
      (response) => {
        if (response.status) {
          this.openReviewDialog();
        } else {
          this.snackBar.open(response.message, 'Close', {
            duration: 3000,
          });
        }
      },
      (error) => {
        console.error('Error checking if user can leave a review:', error);
        this.snackBar.open('Unable to check review eligibility. Please try again later.', 'Close', {
          duration: 3000,
        });
      }
    );
  }

  openReviewDialog(): void {
    const dialogRef = this.dialog.open(ReviewDialogComponent, {
      width: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  pagedReviews() {
    const start = (this.currentPage - 1) * this.reviewsPerPage;
    const end = start + this.reviewsPerPage;
    return this.property.reviews.slice(start, end);
  }

  totalPages() {
    return Math.ceil(this.property.reviews.length / this.reviewsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  getRatingLabel(rating: number): string {
    if (rating >= 4.5) {
      return 'Amazing';
    } else if (rating >= 4.0) {
      return 'Very Good';
    } else if (rating >= 3.5) {
      return 'Good';
    } else if (rating >= 3.0) {
      return 'Fair';
    } else if (rating >= 2.0) {
      return 'Poor';
    } else {
      return 'Very Poor';
    }
  }

  loadBookedDates(): void {
    this.bookingService.getBookedDates(this.property.id).subscribe(dates => {
      dates.forEach((booking) => {
        let tempDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);

        while (tempDate < checkOutDate) {
          this.unavailableDates.add(this.formatDate(tempDate));
          tempDate.setDate(tempDate.getDate() + 1);
        }
      });
      // console.log('Unavailable dates:', this.unavailableDates);
    });
  }

  filterAvailableDates = (date: Date | null): boolean => {
    const today = new Date();

    if (!date) return false;
    const dateString = this.formatDate(date);
    return !this.unavailableDates.has(dateString) && date >= new Date(today.getFullYear(), today.getMonth(), today.getDate());
  };

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  onBookClick() {
    console.log('Proceed to renting!');
    // localStorage.setItem('searchForm', JSON.stringify(this.s));
    localStorage.setItem('selectedProperty', JSON.stringify(this.property));
    this.router.navigate(['/renting'], { state: { property: this.property } });
  }

  onSearchSubmit() {
    console.log('Check-in and check-out submitted!');
  }

}
