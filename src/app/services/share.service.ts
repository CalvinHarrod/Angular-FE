import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
  private triggerRedirectSource = new Subject<void>();
  triggerRedirect$ = this.triggerRedirectSource.asObservable();

  private tokenSource = new BehaviorSubject<string>('');
  currentToken = this.tokenSource.asObservable();

  private sessionIdSource = new BehaviorSubject<string>('');
  currentSessionId = this.sessionIdSource.asObservable();



  constructor() { }

  changeToken(token: string) {
    this.tokenSource.next(token);
  }

  triggerRedirect() {
    console.log('triggerRedirect method called');
    this.triggerRedirectSource.next();
  }

  changeSessionId(sessionId: string) {
    this.sessionIdSource.next(sessionId);
  }


}
