import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor(private http: HttpClient) { }

  getInitToken(mobile: string): Observable<any> {
    // Replace with your actual backend URL
    const url = environment.tokenServerInit;
    return this.http.post(url, { mobile });
  }

  authenticateToken(token: string, mobile: string): Observable<any> {
    const url = environment.tokenServerAuth; // replace with your actual backend URL for token authentication
    return this.http.post(url, { token, mobile });
  }

  deleteToken(mobile: string): Observable<any> {
    return this.http.delete(`${environment.tokenServerDelete}/${mobile}`);
  }
  
}