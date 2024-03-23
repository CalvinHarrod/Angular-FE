
import { Component, OnInit, SecurityContext } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { SharedService } from '../services/share.service';
import { TokenService } from '../services/token.service';
import { CheckEmailService } from '../services/check-email.service';
import { UpdatePwdService } from '../services/update-pwd.service'; 

// if (environment.production) {
//   window.console.log = function() {};
//   window.console.error = function() {};
// }


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements  OnInit {
  
  constructor(

        private router: Router,
        private http: HttpClient,
        private sanitizer: DomSanitizer,
        private sharedService: SharedService,
        private tokenService: TokenService,
        private checkEmailService: CheckEmailService,
        private updatePwdService: UpdatePwdService) { 

          // used for calling from otp component
          this.sharedService.triggerRedirect$.subscribe(() => {
            this.redirect();
          });

  }

    title = 'testFORM';   



    // visible:boolean = false;
    captchaReturn:boolean = false;
    inputPasswordField:boolean = false;
    otpPassword: any;
    visible:boolean = false;
    testflag:boolean = false;
    sliderflag:boolean = false;
    isButtonClicked: boolean = false;

    sliderValue: number = 0;

    countdown: number = 0;
    minutes: number = 0;
    seconds: number = 0;

    userData: any = {};

    showAlert = false;

    formMain: any;

    inputPassword: string = '';
    inputPasswordPart1: string = '';
    inputPasswordPart2: string = '';

    inputField: any;
    inputMobile: string = '';
    inputEmail: string = '';
    

    private BE01_URL = environment.reDirectUrl;
    // private BE01_URL = 'http://10.161.169.13:9700/eform-application/form_main?mobile=';
 
  
    ngOnInit(): void {}

    reloadPage(){
      window.location.reload()
    }  

    backTohomepage(){
      this.router.navigate(['']);
    }
  
    checkInputType(input: string) {
      // Regular expression for email
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      // Regular expression for Hong Kong mobile number
      const mobileRegex = /^[0-9]{8}$/;
    
      if (emailRegex.test(input)) {
        console.log('Input is an email');
        this.inputEmail = input;
        this.sliderflag = true; // Add this line
      } else if (mobileRegex.test(input)) {
        console.log('Input is a mobile number');
        this.inputMobile = input;
        this.sliderflag = true; // Add this line
      } else {
        console.log('Input is not a valid email or mobile number');
        // Display an alert message
        alert('Input invalid, please try again');
        this.backTohomepage();
        this.reloadPage();
        this.sliderflag = false; // Add this line
      }
    }

    checkEmailValidity(email: string) {
      this.checkEmailService.isValidEmail(email).subscribe(
        isValid => {
          if (isValid) {
            console.log('Email is valid');
          } else {
            console.log('Email is not valid');
          }
        },
        error => {
          console.error('Error checking email validity:', error);
        }
      );
    }

 

    updatePassword() {
      this.inputPassword = this.inputPasswordPart1 + "-" + this.inputPasswordPart2;
    }

    // redirect() {
    //   console.log('Redirecting to URL:', this.BE01_URL + this.inputMobile);
    //   //Update Token
    //   //this.callUpdateToken();
    //   // window.location.href = this.BE01_URL + '\?' + 'mobile=' + this.inputMobile;
    //   window.location.href = this.BE01_URL + this.inputMobile;
    // }

    redirect() {
      // Get the token from local storage
      let token = localStorage.getItem('token');
      console.log('Bring Token to redirect:', token);
      // const token = 'your-token-here'; // Replace with your actual token
      // const redirectUrl = `http://10.161.169.13:9800/reDirect/${this.inputMobile}?token=${token}`;
      const redirectUrl = `${this.BE01_URL}${this.inputMobile}?token=${token}`;
      console.log('Redirecting to URL:', redirectUrl);
    
      window.location.href = redirectUrl;
    }


    deleteUserToken(mobile: string) {
      this.tokenService.deleteToken(mobile).subscribe(
        response => {
          console.log('Token deleted successfully');
        },
        error => {
          console.error('Error deleting token:', error);
        }
      );
    }

    callUpdatePassword(token: string, mobile: string, ) {
      this.updatePwdService.updatePassword(token, mobile).subscribe(
        response => {
          console.log('Password updated successfully');
          this.redirect();
        },
        error => {
          console.error('Error updating password:', error);
          //alert("Password incorrect, Please try again");
          this.backTohomepage()
          this.reloadPage()
        }
      );
    }


    downCount() {
      
      // Start the countdown
      this.countdown = 120;
      const countdown$ = interval(1000).pipe(take(this.countdown));

      countdown$.subscribe(() => {
        this.seconds = this.countdown;
        this.countdown--;
        if (this.countdown <= 0) {
          alert("Timed out, Please try again");
          this.backTohomepage();
          this.reloadPage();
        }
      });


    }


    update(){

        this.testflag = false;
        this.visible = true;
        this.sliderflag = false;
    
    }

    capRtnFunction(data: boolean){
      // setTimeout(() => {
      this.captchaReturn = data;
    // },0);
  }

    otpRtnFunction1(data: any){
      this.otpPassword = data;
      // this.otpPassword = '12345678';
    }

    otpRtnFunction2(data: any){
      this.inputPasswordField = data;
    }

    auth(){

      this.updatePassword();

      if(this.otpPassword == this.inputPassword){

        let token = localStorage.getItem('token');
        console.log('Bring Token to update pwd:', token);
        if (token !== null) {
         this.callUpdatePassword(token, this.inputMobile );
        }

        this.redirect();
     

      }else{
        // console.log("OTP password is "+ this.otpPassword);
        // console.log("Input password is "+ this.inputPassword);
        alert("Login Failed, Please try again");
        console.log("Login Failed, delete token and redirect to homepage");
        this.deleteUserToken(this.inputMobile);
        this.backTohomepage()
        this.reloadPage()
      }
    }

     onSliderChange(value: number) {
      if (value === 5) {
        this.update();
      }
    }

    sliderUpdate(){
      this.checkInputType(this.inputField)
      //this.checkEmailValidity(this.inputEmail);
      this.isButtonClicked = true;
      this.sliderflag = true;
    }
    


}


