import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core'; // Import SecurityContext from '@angular/core' instead of '@angular/platform-browser'

import { environment } from '../../environments/environment';

if (environment.production) {
  window.console.log = function() {};
  window.console.error = function() {};
}


@Injectable({
  providedIn: 'root'
})
export class MobileCheckService {

  private CHECK_URL = environment.checkUrl + 
    'eform-application/ajax/checkMobile?mobile=';

  // constructor(private http: HttpClient) { }
  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  // checkMobile(mobile: string) {
  //   return this.http.get<boolean>(this.CHECK_URL + mobile);
  // }

  // checkMobile(mobile: string) {
  //   let encodedUrl = btoa(this.CHECK_URL + mobile);
  //   console.log('Requesting URL:', encodedUrl);
  //   return this.http.get<boolean>(atob(encodedUrl));
  // }

  checkMobile(mobile: string) {
    let url = this.CHECK_URL + mobile;
    let sanitizedUrl = this.sanitizer.sanitize(SecurityContext.URL, url);
    if (sanitizedUrl) {
      console.log('Requesting URL:', sanitizedUrl);
      return this.http.get<boolean>(sanitizedUrl);
    } else {
      // Handle the error
    }
    return throwError('Sanitized URL is null.'); // Add this line to return a value in case of error
  }

}





