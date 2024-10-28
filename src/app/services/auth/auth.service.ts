import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtSubject = new BehaviorSubject<string | null>(null);
  private apiUrl = environment.userService + "/permissions";

  // constructor(private http: HttpClient) {
  //   const currentJwt = sessionStorage.getItem("jwt") || localStorage.getItem("jwt");
  //   this.jwtSubject.next(currentJwt);
  // }

  constructor(private http: HttpClient) {
    const currentJwt = this.getJwt();
    if (currentJwt && this.isTokenExpired()) {
      this.logout();
    } else {
      this.jwtSubject.next(currentJwt);
    }
  }

  loginEmployee(email: string, password: string): Observable<any> {
    return this.http.post(environment.userService + "/auth/login/employee", { email, password }).pipe(
      map((response: any) => {
        console.log(response);
        this.setJwt(response.jwt, response.permissions);
        return response;
      })
    );
  }

  loginCustomer(email: string, password: string, rememberMe: boolean): Observable<any> {
    return this.http.post(environment.userService + "/auth/login/customer", { email, password, rememberMe}).pipe(
      map((response: any) => {
        console.log(response);
        this.setJwt(response.jwt, response.permissions);
        return response;
      })
    );
  }

  setJwt(token: string, permissions: any) {
    const expirationDate = this.getTokenExpirationDate(token);
    console.log("EXPIRATION DATE: " + expirationDate);

    localStorage.setItem('jwt', token);
    localStorage.setItem('permissions', permissions);
    localStorage.setItem('isOwnerOfProperty', String(false));
    localStorage.setItem('jwt_expiration', expirationDate.toString());

    this.jwtSubject.next(token);
  }

  getJwt(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getJwt();
  }

  getLoggedInStatus(): Observable<string | null> {
    return this.jwtSubject.asObservable();
  }


  logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('permissions');
    localStorage.removeItem('isOwnerOfProperty');
    localStorage.removeItem('jwt_expiration');
    this.jwtSubject.next(null);
  }

  private isTokenExpired(): boolean {
    const expiration = localStorage.getItem('jwt_expiration');
    if (!expiration) return true;

    const expirationDate = new Date(expiration);
    return expirationDate <= new Date();
  }

  private getTokenExpirationDate(token: string): Date {
    // Decode JWT and extract expiration (exp) field
    const payload = JSON.parse(atob(token.split('.')[1]));
    return new Date(payload.exp * 1000); // Convert to milliseconds
  }

}
