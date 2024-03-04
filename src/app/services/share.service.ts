import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private triggerRedirectSource = new Subject<void>();
  triggerRedirect$ = this.triggerRedirectSource.asObservable();

  triggerRedirect() {
    console.log('triggerRedirect method called');
    this.triggerRedirectSource.next();
  }
}