import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IpService {
  private apiUrl = 'https://eform.tvb.com.hk:9889/api/get-public-ip';

  constructor(private http: HttpClient) {}

  getIp(): Observable<{ ip: string, internal: boolean }> {
    return this.http.get<{ ip: string, internal: boolean }>(this.apiUrl).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching IP:', error);
        // Return default value in case of error
        return of({ ip: '10.10.10.10', internal: false });
      })
    );
  }
}