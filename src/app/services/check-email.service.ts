import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class CheckEmailService {

  constructor(private http: HttpClient) { }

  isValidEmail(email: string): Observable<boolean> {
    const url = `${environment.checkEmail}${email}`;
    console.log(`URL for checking email: ${url}`);
    console.log(`Checking if email is valid: ${email}`);
    return this.http.get<boolean>(url).pipe(
      tap(response => console.log(`Response from server: ${response}`))
    );
  }
}