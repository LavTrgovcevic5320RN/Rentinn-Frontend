import { Component, OnInit} from '@angular/core';
import {Image} from '@failed-successfully/ngx-darkbox-gallery';
import PhotoSwipe from 'photoswipe';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import {Property} from '../../models/model';
import * as L from 'leaflet';

const property: Property = {
  id: 1,
  name: 'Hotel Jugoslavija',
  location: 'Serbia, Belgrade, Balkanska 1',
  rating: 4.5,
  price: 200,
  images: [{ url: 'https://picsum.photos/seed/3000/2000', thumbnailUrl: 'https://picsum.photos/300/200' }, { url: 'https://picsum.photos/seed/3001/2000', thumbnailUrl: 'https://picsum.photos/301/200' }, { url: 'https://picsum.photos/seed/3002/2000', thumbnailUrl: 'https://picsum.photos/302/200' }, { url: 'https://picsum.photos/seed/3003/2000', thumbnailUrl: 'https://picsum.photos/303/200' }, { url: 'https://picsum.photos/seed/3004/2000', thumbnailUrl: 'https://picsum.photos/304/200' },],
  freebies: ['Free breakfast', 'Free WiFi'],
  amenities: ['24hr front desk', 'air-conditioned', 'fitness', 'pool', 'sauna', 'spa', 'bar', 'restaurant', 'wi-fi', 'pet-friendly', 'family rooms', 'room service', 'concierge service', 'laundry service', 'fitness center', 'non-smoking rooms', 'outdoor pool', 'indoor pool', 'business center', 'conference rooms', 'meeting facilities', 'breakfast buffet', 'private beach', 'hot tub', 'massage', 'all-inclusive', 'casino', 'airport transfer', 'elevator', 'balcony/terrace', 'kitchenette'],
  description: 'Hotel Jugoslavija is a luxurious hotel located in the heart of Belgrade. It offers a wide range of amenities and services to make your stay as comfortable as possible. The hotel is located in a prime location, close to many attractions and landmarks. The hotel offers luxurious rooms, a fitness center, a pool, a spa, a restaurant, and much more. The hotel is pet-friendly and offers free WiFi to all guests. The hotel is perfect for business travelers, families, and couples looking for a relaxing getaway.',
  highlights: ['Luxurious rooms', 'Great location', 'Friendly staff'],
  reviews: [{ id: 1, rating: 4.5, comment: 'Great hotel', name: 'John Doe' }, { id: 2, rating: 5, comment: 'Amazing experience', name: 'Jane Doe' }, { id: 3, rating: 4, comment: 'Highly recommended', name: 'Alice Smith' },],
  longitude: 20.460419872916667,
  latitude: 44.812875950000006,
  checkIn: '14:00',
  checkOut: '12:00',
};

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrl: './property.component.css'
})
export class PropertyComponent implements OnInit {
  private lightbox: PhotoSwipeLightbox | undefined;

  images: Image[] = [
    { url: 'https://picsum.photos/seed/3000/2000', thumbnailUrl: 'https://picsum.photos/300/200' },
    { url: 'https://picsum.photos/seed/3001/2000', thumbnailUrl: 'https://picsum.photos/301/200' },
    { url: 'https://picsum.photos/seed/3002/2000', thumbnailUrl: 'https://picsum.photos/302/200' },
    { url: 'https://picsum.photos/seed/3003/2000', thumbnailUrl: 'https://picsum.photos/303/200' },
    { url: 'https://picsum.photos/seed/3004/2000', thumbnailUrl: 'https://picsum.photos/304/200' },
    { url: 'https://picsum.photos/seed/3005/2000', thumbnailUrl: 'https://picsum.photos/305/200' },
    { url: 'https://picsum.photos/seed/3006/2000', thumbnailUrl: 'https://picsum.photos/306/200' },
  ];

  visibleImages: Image[] = [];
  initialVisibleCount = 5; // Number of thumbnails to show initially

  ngOnInit(): void {
    this.initializeVisibleImages();
    this.initPhotoSwipe();
    this.configMap();
  }

  initializeVisibleImages(): void {
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


  protected readonly property = property;

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

  // Get visible amenities based on the flag
  get visibleAmenities(): string[] {
    if (this.showAllAmenities) {
      return this.property.amenities;
    }
    return this.property.amenities.slice(0, this.visibleAmenitiesCount);
  }

  // Calculate how many amenities are hidden
  get remainingAmenitiesCount(): number {
    return this.property.amenities.length - this.visibleAmenitiesCount;
  }

  // Toggle the visibility of all amenities
  showMoreAmenities(): void {
    this.showAllAmenities = true;
  }




  map: any;

  configMap() {
    this.map = L.map('map', {
      center: [property.latitude, property.longitude],
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

    L.marker([property.latitude, property.longitude], { icon: materialIcon }).addTo(this.map)
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
