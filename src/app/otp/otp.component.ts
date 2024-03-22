
import { AppComponent } from './../app.component';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { MobileCheckService } from '../services/mobile-check.service';
import { SmsService } from '../services/sms.service';
import { TokenService } from '../services/token.service';
import { SharedService } from '../services/share.service';
import { environment } from '../../environments/environment';



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
    private smsService: SmsService,
    private tokenService: TokenService,
    private sharedService: SharedService){}

  ngOnInit(): void {}

  

  generatePassword() {
    const min = 1000; // Minimum 4-digit number
    const max = 9999; // Maximum 4-digit number
    const part1 = Math.floor(Math.random() * (max - min + 1) + min);
    const part2 = Math.floor(Math.random() * (max - min + 1) + min);
    this.password = `${part1}-${part2}`;
  }


  // sentSMS(){

  //     this.smsService.sendSms(
  //       this.otpMobile,
  //       '&smsMessage=',
  //       this.message,
  //       this.password
  //       ).subscribe(
  //         res => {
  //           this.sentResult = res;
  //           console.log("Sent SMS - Return Result is " + this.sentResult);
  //         },
  //         err => {
  //           console.error('Error:', err);
  //           alert("An error occurred while sent SMS. Please try again later.");
  //         }
  //       );

  //     console.log("Sent SMS - Mobile number is " + this.otpMobile);
      
  // }

  sentSMS(){

    this.smsService.sendSms(this.otpMobile, this.password).subscribe(
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

//  queryBackend() {
//   this.mobileCheckService.checkMobile(this.otpMobile).subscribe(
//     res => {
//       this.checkresult = res;
//       this.otpButton = true;
//       console.log("this.checkresult b4 - this.handleResponse  " + this.checkresult);
//       this.handleResponse();
//     },
//     err => {
//       console.error('Error:', err);
//       alert("An error occurred while checking the mobile number. Please try again later.");
//     }
//   );
// }

initToken() {
  // If the user doesn't have a token, get a new one
  this.tokenService.getInitToken(this.otpMobile).subscribe(
    tokenRes => {
      console.log('Init token received:', tokenRes.token);
      // Save the new token in local storage
      localStorage.setItem('token', tokenRes.token);

      // Log the token after it's saved to local storage
      console.log('Token saved to local storage:', localStorage.getItem('token'));

      // Then call handleResponse
      this.handleResponse();
    },
    tokenErr => {
      console.error('Error requesting init token:', tokenErr);
      alert("An error occurred while requesting an init token. Please try again later.");
    }
  );
}


queryBackend() {
  this.mobileCheckService.checkMobile(this.otpMobile).subscribe(
    res => {

            console.log('Response from checkMobile:', JSON.stringify(res, null, 2));
            // alert("Response from checkMobile: " + res); 

            console.log('Response result:', res.result);
            console.log('Response message:', res.message);

            // alert("check respond result ");

            // Handle Special number
            if (res.result === true && res.message === "jump") {
                console.log('Special Jump from checkMobile:', res.result, 'Response message:', res.message);
                this.sharedService.triggerRedirect();
                return;
            }

              if (res.result === true ) {        
              console.log('Response true from checkMobile:', res.result, 'Response message:', res.message);
              this.otpButton = true;
              this.checkresult = true;
              // Get the token from local storage
              let token = localStorage.getItem('token');
              console.log('Local storage:', localStorage);
              console.log('Token before check:', token);

              if (token) {

                    // Log the token
                    console.log('Token inside check:', token);

                    // If the user already has a token, authenticate it
                    this.tokenService.authenticateToken(token, this.otpMobile).subscribe(
                      authRes => {
                        console.log('Token authenticated:', authRes);

                        // Then call handleResponse
                        //this.handleResponse();
                        // Call Redirect and bypass sms authentication
                        this.sharedService.triggerRedirect();
                      },

                      authErr => {
                        if (authErr.status === 401) {
                            console.error('Token has expired:', authErr);
                            this.initToken();
                            //this.handleResponse();
                          } else if (authErr.status === 403) {
                          console.error('Token not found:', authErr);
                          this.initToken();
                          //this.handleResponse();
                          } else {
                          console.error('An error occurred while authenticating the token:', authErr);
                          // Redirect to homepage
                          this.router.navigate([environment.homePage]);
                        }
                      }
                    ); // end of subscribe

              } else {
                // If the user doesn't have a token, get a new one
                this.initToken();
              }
            }else{
              alert("Your input mobile is not valid. Please try again later.");
              this.backTohomepage();
              this.reloadPage();
            }

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


