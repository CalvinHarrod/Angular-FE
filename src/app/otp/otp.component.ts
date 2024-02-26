
import { AppComponent } from './../app.component';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MobileCheckService } from '../services/mobile-check.service';
import { SmsService } from '../services/sms.service';




@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})

export class OtpComponent implements OnInit {
  @Input() otpMobile: any;
  // @Input() otpButton: any;

  // @Output() parentFunction:EventEmitter<any> = new EventEmitter();
  @Output() otpRtnFunction1:EventEmitter<number> = new EventEmitter<number>();
  @Output() otpRtnFunction2:EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() triggerDownCount = new EventEmitter<void>();

  password: any;
  inputpassword: any = {};

  otpButton = false;
  title = '';
  message = 'The OTP password is '

  checkresult: boolean = false; 
  sentResult: boolean = false;
  

  // constructor(private http: HttpClient){}
  constructor(
    private http: HttpClient, 
    private router: Router, 
    private mobileCheckService: MobileCheckService,
    private smsService: SmsService){}

  ngOnInit(): void {}

  generatePassword() {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    const part1 = Math.floor(Math.random() * (max - min + 1) + min);
    const part2 = Math.floor(Math.random() * (max - min + 1) + min);
    this.password = `${part1}-${part2}`;
  }


  sentSMS(){

      this.smsService.sendSms(
        this.otpMobile,
        '&smsMessage=',
        this.message,
        this.password
        ).subscribe(
          res => {
            this.sentResult = res;
            console.log("Sent SMS - Return Result is " + this.sentResult);
          },
          err => {
            console.error('Error:', err);
            alert("An error occurred while sent SMS. Please try again later.");
          }
        );

      console.log("Sent SMS - Mobile number is " + this.otpMobile);
      
  }

  openToggle(){
    this.router.navigate(['/fail']);
  }

  backTohomepage(){
    this.router.navigate(['']);
  }

  //Reload the component
  reloadComponent(self:boolean,urlToNavigateTo ?:string){
   const url=self ? this.router.url :urlToNavigateTo;
   this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
     this.router.navigate([`/${url}`])
   })
 }

 reloadPage(){
   window.location.reload()
 }

  queryBackend() {
    this.mobileCheckService.checkMobile(this.otpMobile).subscribe(
      res => {
        this.checkresult = res;
        this.otpButton = true;
        console.log("this.checkresult b4 - this.handleResponse  " + this.checkresult);
        this.handleResponse();
      },
      err => {
        console.error('Error:', err);
        alert("An error occurred while checking the mobile number. Please try again later.");
      }
    );
  }

  handleResponse() {
    if (this.checkresult) {
      console.log("this.otpButton b4 -  " + this.checkresult);
      this.otpButton = true;
      console.log("this.otpButton aft -  " + this.checkresult);

      this.generatePassword();
      this.sentSMS(); // check-point 20231225
      this.triggerDownCount.emit();
      this.otpRtnFunction2.emit(this.checkresult);
      this.otpRtnFunction1.emit(this.password);
    } else {
      alert("Your Mobile Number is not registered. Please contact your administrator.");
      this.otpButton = true;
      this.backTohomepage();
      this.reloadPage();
    }
  }

  checkMobile() {
    this.otpButton = true;
    console.log("checkMobile - Mobile number is " + this.otpMobile);
    this.queryBackend();
    
    //this.handleResponse();
  }

  
}


