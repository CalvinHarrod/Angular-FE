import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// if (environment.production) {
//   window.console.log = function() {};
//   window.console.error = function() {};
// }

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  //private SENT_URL = 'http://10.161.169.13:7000/eform-application/ajax/sendSMS?mobile=';

  // private SENT_URL = environment.smsMobile + 'eform-application/ajax/sendSMS?mobile=';
  private SENT_URL = environment.smsMobile;

  constructor(private http: HttpClient) { }


  sendSms(mobile: string, password: string): Observable<any> {
    const url = `${this.SENT_URL}/eform-application/ajax/sendSMS?mobile=${mobile}&password=${password}`;
    console.log(`Request URL: ${url}`);
    return this.http.get(url);
}

  

  
}
