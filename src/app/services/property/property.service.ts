import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Property} from '../../models/model';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  private apiUrl = 'https://api.example.com/properties';

  constructor(private httpClient: HttpClient) {}

  fetchProperties(values: any): Observable<Property[]> {
    console.log('U property-service fetch properties:', values);

    // return this.httpClient.get<Property[]>(this.apiUrl, { params: values });
    const url = `assets/properties.json`;
    return this.httpClient.get<Property[]>(url);
  }

  // getAllProperties(): Observable<any[]> {
  //   return this.httpClient.get<any[]>(this.apiUrl);
  // }

  // getAllProperties(): Observable<Property[]> {
  //   const url = `assets/properties.json`;
  //   return this.httpClient.get<Property[]>(url);
  // }


  getAllProperties(): Observable<Property[]> {
    const url = `assets/properties.json`;
    return this.httpClient.get<Property[]>(url);
  }

  fetchAmenities(): Observable<string[]> {
    const url = `assets/amenities.json`;
    return this.httpClient.get<string[]>(url);
  }

  // getAllProperties(): Observable<IProperty[]> {
  //   const url = `assets/iproperty.json`;
  //   return this.httpClient.get<IProperty[]>(url);
  // }
}
