import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

if (environment.production) {
  window.console.log = function() {};
  window.console.error = function() {};
}

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  //private SENT_URL = 'http://10.161.169.13:7000/eform-application/ajax/sendSMS?mobile=';

  private SENT_URL = environment.checkUrl + 'eform-application/ajax/sendSMS?mobile=';

  constructor(private http: HttpClient) { }


  // sendSms(
  //   mobile: string, 
  //   fixmessage: string,
  //   messages: string,
  //   password: string): Observable<boolean> {
  //   return this.http.get<boolean>(
  //     this.SENT_URL + 
  //     mobile + 
  //     fixmessage +
  //     messages +
  //     password);
  // }

  sendSms(
    mobile: string, 
    fixmessage: string,
    messages: string,
    password: string): Observable<boolean> {
    let encodedUrl = btoa(this.SENT_URL + mobile + fixmessage + messages + password);
    console.log('Requesting URL:', encodedUrl);
    return this.http.get<boolean>(atob(encodedUrl));
  }

  

  
}
