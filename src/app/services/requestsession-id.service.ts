import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestsessionIDService {

  constructor(private http: HttpClient) { }

      querySessionID(): Observable<string> {
        const url = environment.sessionID; // Assuming environment.sessionID is the complete URL
        return this.http.get<string>(url); // Perform the GET request and expect a string response
    }
}


