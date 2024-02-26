import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Component({
  selector: 'app-captcha',
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.css']
})
export class CaptchaComponent implements OnInit {

  @Output() capRtnFunction:EventEmitter<boolean> = new EventEmitter<boolean>();
  
  captcha: string;
  email: string;

  constructor(){
    this.captcha = '';
    // this.email = 'tamchihong@gmail.com';
    this.email = 'tvb.redform@gmail.com';
  }

  ngOnInit(): void {}

  resolved(captchaResponse: string){
    this.captcha = captchaResponse;
    console.log('resolved captcha with response: ' + this.captcha);
    this.capRtnFunction.emit(true);

  }


}
