import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdatePwdService {

  constructor(private http: HttpClient) { }

  updatePassword(token: string, mobile: string ): Observable<any>  {
    const url = environment.updatePwd;
    return this.http.post(url, {token,mobile});
  }

}