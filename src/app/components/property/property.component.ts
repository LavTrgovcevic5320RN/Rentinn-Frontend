import { Component, OnInit} from '@angular/core';
import {Image} from '@failed-successfully/ngx-darkbox-gallery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import {Property} from '../../models/model';
import * as L from 'leaflet';
import {PropertyService} from '../../services/property/property.service';
import {auto} from '@popperjs/core';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrl: './property.component.css'
})
export class PropertyComponent implements OnInit {
  property!: Property;
  visibleImages: Image[] = [];
  initialVisibleCount = 5;
  images: Image[] = [];
  private lightbox: PhotoSwipeLightbox | undefined;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    const propertyId = localStorage.getItem('selectedProperty') ? JSON.parse(localStorage.getItem('selectedProperty') || '{}') : {};
    // console.log('Property ID:', propertyId);
    this.fetchProperty(propertyId);
  }

  fetchProperty(propertyId: any) {
    this.propertyService.fetchProperty(propertyId).subscribe(property => {
      this.property = property;
      // console.log('Property:', this.property);
      this.initializeVisibleImages();
      this.initPhotoSwipe();
      this.configMap();
    });
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
        // width: 2000,
        width: 2500,
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

  visibleAmenitiesCount = 8;
  showAllAmenities = false;

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

  getAmenityIcon(amenity: string): string {
    return this.amenitiesIcons[amenity as keyof typeof this.amenitiesIcons] || 'help_outline';
  }

  // get visibleAmenities(): string[] {
  //   if (this.showAllAmenities) {
  //     return this.property.amenities;
  //   }
  //   return this.property.amenities.slice(0, this.visibleAmenitiesCount);
  // }

  // get remainingAmenitiesCount(): number {
  //   return this.property.amenities.length - this.visibleAmenitiesCount;
  // }
  //
  // showMoreAmenities(): void {
  //   this.showAllAmenities = true;
  // }


  map: any;

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
      iconAnchor: [15, 42]
    });

    L.marker([this.property.latitude, this.property.longitude], { icon: materialIcon }).addTo(this.map)
      // .bindPopup(`<b>${property.name}</b><br>${property.location}`)
      .openPopup();
  }


  isFavorited = false;

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

  onBookClick() {
    console.log('Proceed to booking!');
  }




  reviewsPerPage = 2;
  currentPage = 1;

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

}
