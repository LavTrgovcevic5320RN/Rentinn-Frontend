import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private jwtSubject = new BehaviorSubject<string | null>(null);  // Ovaj subject prati promene u JWT
  private apiUrl = environment.userService + "/permissions";

  constructor(private http: HttpClient) {
    const currentJwt = sessionStorage.getItem("jwt") || localStorage.getItem("jwt");
    this.jwtSubject.next(currentJwt);
  }

  loginEmployee(email: string, password: string): Observable<any> {
    return this.http.post(environment.userService + "/auth/login/employee", { email, password }).pipe(
      map((response: any) => {
        console.log(response);
        this.setJwt(response.jwt, response.permissions, false);
        return response;
      })
    );
  }

  loginCustomer(email: string, password: string): Observable<any> {
    return this.http.post(environment.userService + "/auth/login/customer", { email, password }).pipe(
      map((response: any) => {
        console.log(response);
        this.setJwt(response.jwt, response.permissions, false);
        return response;
      })
    );
  }

  setJwt(token: string, permissions: any, rememberMe: boolean) {
    if(rememberMe) {
      localStorage.setItem('jwt', token);
      localStorage.setItem('permissions', permissions);
      localStorage.setItem('isOwnerOfProperty', String(false));
    } else {
      sessionStorage.setItem('jwt', token);
      sessionStorage.setItem('permissions', permissions);
      sessionStorage.setItem('isOwnerOfProperty', String(false));
    }

    this.jwtSubject.next(token);
  }

  getJwt(): string | null {
    return localStorage.getItem('jwt') || sessionStorage.getItem('jwt');
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
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('permissions');
    sessionStorage.removeItem('isOwnerOfProperty');
    this.jwtSubject.next(null);
  }

}
