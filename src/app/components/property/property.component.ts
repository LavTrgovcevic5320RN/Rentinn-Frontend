import { Component, OnInit} from '@angular/core';
import {Image} from '@failed-successfully/ngx-darkbox-gallery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import {Property} from '../../models/model';
import * as L from 'leaflet';
import {PropertyService} from '../../services/property/property.service';

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
    console.log('Property ID:', propertyId);
    this.fetchProperty(propertyId);
  }

  fetchProperty(propertyId: any) {
    this.propertyService.fetchProperty(propertyId).subscribe(property => {
      this.property = property;
      console.log('Property:', this.property);
      this.initializeVisibleImages();
      this.initPhotoSwipe();
      this.configMap();
    });
  }

  // initializeVisibleImages(): void {
  //   this.visibleImages = this.images.slice(0, this.initialVisibleCount);
  // }

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

    // Add filter for total number of items (all images)
    this.lightbox.addFilter('numItems', () => {
      return this.images.length; // Use the total number of images in the gallery
    });

    // Add filter to provide item data for PhotoSwipe
    this.lightbox.addFilter('itemData', (itemData, index) => {
      const image = this.images[index];
      return {
        src: image.url, // Full image URL when opened in the gallery
        width: 2000, // Adjust the width to match the full-size image
        height: 2000 // Adjust the height to match the full-size image
      };
    });

    this.lightbox.init();
  }

  // Open the gallery starting from the clicked image's index
  openGalleryFromIndex(index: number): void {
    if (this.lightbox) {
      this.lightbox.loadAndOpen(index); // Open the gallery at the clicked item's index
    }
  }


  // protected readonly property = property;

  visibleAmenitiesCount = 8; // Number of amenities to show initially
  showAllAmenities = false; // Flag to show all amenities

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

  // To dynamically get the icon for an amenity
  getAmenityIcon(amenity: string): string {
    return this.amenitiesIcons[amenity as keyof typeof this.amenitiesIcons] || 'help_outline';
  }

  // // Get visible amenities based on the flag
  // get visibleAmenities(): string[] {
  //   if (this.showAllAmenities) {
  //     return this.property.amenities;
  //   }
  //   return this.property.amenities.slice(0, this.visibleAmenitiesCount);
  // }

  // // Calculate how many amenities are hidden
  // get remainingAmenitiesCount(): number {
  //   return this.property.amenities.length - this.visibleAmenitiesCount;
  // }
  //
  // // Toggle the visibility of all amenities
  // showMoreAmenities(): void {
  //   this.showAllAmenities = true;
  // }




  map: any;

  configMap() {
    this.map = L.map('map', {
      center: [this.property.latitude, this.property.longitude],
      zoom: 15,
    });

    // // Add OpenStreetMap tiles
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

    // Create a custom icon using a Material Icon inside a div
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

  // Favorite button click handler
  onFavoriteClick() {
    this.isFavorited = !this.isFavorited;
    if (this.isFavorited) {
      console.log('Hotel added to favorites!');
      // alert('Hotel added to favorites!');
    } else {
      console.log('Hotel removed from favorites!');
      // alert('Hotel removed from favorites!');
    }
  }

  // Share button click handler
  onShareClick() {
    const shareUrl = window.location.href; // Share the current page URL
    console.log('Sharing hotel:', shareUrl);
    // alert(`Sharing hotel: ${shareUrl}`);
  }

  // Book now button click handler
  onBookClick() {
    console.log('Proceed to booking!');
    // alert('Proceed to booking!');
  }

}
