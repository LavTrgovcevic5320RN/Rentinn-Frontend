import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer, EditCustomerRequest, Property} from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.userService + "/customer";

  constructor(private httpClient: HttpClient) {}

  fetchLoggedInUser(): Observable<Customer> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    return this.httpClient.get<Customer>(`${this.apiUrl}/get`, { headers });
  }

  updateCustomer(values: any): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    const editCustomerRequest: EditCustomerRequest = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
      address: values.address,
      dateOfBirth: new Date(values.dateOfBirth)
    };

    console.log('Body:', editCustomerRequest);

    return this.httpClient.put<boolean>(`${this.apiUrl}/edit`, editCustomerRequest, { headers });
  }


  editFavoriteProperties(customerId: number, propertyId: number, favorite: boolean): Observable<boolean> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    });

    const body = {
      customerId,
      propertyId,
      favorite
    };

    console.log('Body:', body);

    return this.httpClient.put<boolean>(`${this.apiUrl}/favorites`, body, { headers });
  }

}
