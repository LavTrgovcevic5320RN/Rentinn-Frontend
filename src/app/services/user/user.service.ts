import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer, Property} from '../../models/model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.userService + "/customer";

  constructor(private httpClient: HttpClient) {}

  fetchLoggedInUser(): Observable<Customer> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + (sessionStorage.getItem('jwt') || localStorage.getItem('jwt'))
    });

    return this.httpClient.get<Customer>(`${this.apiUrl}/get`, { headers });
  }


}
