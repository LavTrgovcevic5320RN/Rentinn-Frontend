import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor() { }

  isTokenFormatValid(token: string): boolean {
    return token.split(".").length === 3;
  }
}
