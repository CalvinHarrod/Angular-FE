import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core'; // Import SecurityContext from '@angular/core' instead of '@angular/platform-browser'

import { environment } from '../../environments/environment';

// if (environment.production) {
//   window.console.log = function() {};
//   window.console.error = function() {};
// }

interface CheckMobileResponse {
  result: boolean;
  message1: string;
  message2: string;
  message3: string;
}

@Injectable({
  providedIn: 'root'
})
export class MobileCheckService {

    private CHECK_URL = environment.checkMobile + 
      'eform-application/ajax/checkMobile?mobile=';

    // constructor(private http: HttpClient) { }
    constructor(private http: HttpClient) { }

  
    checkMobile(mobile: string, sessionID: string): Observable<CheckMobileResponse> {
      let url = `${this.CHECK_URL}${mobile}&sessionID=${sessionID}`;
      console.log('Requesting URL:', url);
      return this.http.get<CheckMobileResponse>(url);
    }
}

  





