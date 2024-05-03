import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }
  
  private triggerRedirectSource = new Subject<void>();
  triggerRedirect$ = this.triggerRedirectSource.asObservable();

  private tokenSource = new BehaviorSubject<string>('');
  currentToken = this.tokenSource.asObservable();



  changeToken(token: string) {
    this.tokenSource.next(token);
  }

  triggerRedirect() {
    console.log('triggerRedirect method called');
    this.triggerRedirectSource.next();
  }
}