
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
import { RequestsessionIDService } from '../services/requestsession-id.service';
import { IpService } from '../services/ip.service';


// Place this code in a central part of your application, 
// such as the main.ts file or at the beginning of the AppComponent

if (environment.production) { // Only disable console in production
  window.console.log = () => {};
  window.console.warn = () => {};
  window.console.error = () => {};
  // Add any other console methods you want to disable
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements  OnInit {

  
    title = 'testFORM';   

    // environment variables, retrun path
    homepageUrl = environment.homepageUrl;

    //control second page
    firstPage:boolean = true;
    secondPage:boolean = false;
    disclaimer:boolean = false;


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

    // showAlert = false;

    formMain: any;

    inputPassword: string = '';
    inputPasswordPart1: string = '';
    inputPasswordPart2: string = '';

    inputField: any;
    inputMobile: string = '';
    inputEmail: string = '';

    // Button display control
    redFormButton: boolean = false;
    tvbAaButton: boolean = false;
    tvbPaButton: boolean = false;
    freelanceCompanyButton: boolean = false;
    freelancerButton: boolean = false;
    othersButton: boolean = false;
    tvbPaAaButton: boolean = false;
    fourRunDownFormButton: boolean = false;

    sessionID: string | null = null; // Assuming sessionID is a string. Adjust the type as necessary.

    newGenToken: any;

    disclaimerText: string = `The information contained in this system/website is intended solely 
                              for the use of authorized individuals/entities and may contain confidential 
                              and privileged information. Any unauthorized disclosure, copying, distribution, 
                              or reliance on the contents of this system/website is strictly prohibited. We do 
                              not accept any liability for any errors or omissions in the content of this system/website 
                              or for any loss or damage arising from the use of this system/website or its contents. 
                              Please be aware that the transmission of information over the internet is not completely 
                              secure, and therefore, we cannot guarantee the confidentiality or integrity of any 
                              information transmitted to or from this system/website. We advise users to exercise caution 
                              when transmitting sensitive or confidential information and to use secure channels for 
                              communication. Furthermore, we reserve the right to monitor all communications and 
                              activities on this system/website for compliance with legal, regulatory, and professional 
                              standards. By accessing and using this system/website, you acknowledge and consent to such 
                              monitoring. If you have received any information from this system/website in error, please 
                              notify us immediately by replying and delete it from your system.`;


    private BE01_URL = environment.reDirectUrl;

    showCustomAlert: boolean = false;


    constructor(

      private router: Router,
      private http: HttpClient,
      private sanitizer: DomSanitizer,
      private sharedService: SharedService,
      private tokenService: TokenService,
      private checkEmailService: CheckEmailService,
      private updatePwdService: UpdatePwdService,
      private requestsessionIDService: RequestsessionIDService,
      private ipService: IpService) { 

        // used for calling from otp component
        this.sharedService.triggerRedirect$.subscribe(() => {
          this.redirect();
        });

        this.sharedService.currentToken.subscribe(token => this.newGenToken = token);

    }
    
    ngOnInit(): void {

      this.ipService.getIp().subscribe(
        (response: { ip: string, internal: boolean }) => {
          console.log('Received response from IP service:', response);
          console.log(`IP Address: ${response.ip}`);
          if (response.internal) {
            console.log('Internal IP detected');
            this.handleInternalIp();
          } else {
            console.log('External IP detected');
            this.handleExternalIp();
          }
        },
        error => {
          console.error('Error fetching IP:', error);
        }
      );
        
    }
  
    private handleInternalIp(): void {
      this.redFormButton = true;
      this.fourRunDownFormButton = true;
      this.freelanceCompanyButton = true;
      this.freelancerButton = true;
      this.tvbAaButton = true;
      this.tvbPaButton = true;
    }
  
    private handleExternalIp(): void {
      this.freelanceCompanyButton = true;
      this.freelancerButton = true;
      this.othersButton = true;
      this.tvbPaAaButton = true;
    }

    //-----------------------------------------------

    reloadPage(){
      window.location.reload()
    }  

    backTohomepage(){
      this.router.navigate(['']);
    }

    getTokenFromLocalStorage() {
      return localStorage.getItem('token');
    }

    setPages() {
      // console.log('Setting pages');
      this.firstPage = false;
      this.disclaimer = true;
    }

    onAccept(){
      this.disclaimer = false;
      this.secondPage = true;
    }

    onCancel(){
      this.backTohomepage();
      this.reloadPage();
    }

    
    navigateToLogin(): void {
      window.location.href = 'https://eform.tvb.com.hk:8888/login';
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
      // this.inputPassword = this.inputPasswordPart1 + "-" + this.inputPasswordPart2;
      this.inputPassword = this.inputPasswordPart1 + this.inputPasswordPart2;
    }


    redirect() {
      // Get the token from local storage
      let token = localStorage.getItem('token');
      console.log('Bring Token to redirect:', token);
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

    // New method to call RequestSessionIdService and get sessionID
    getSessionID() {
      this.requestsessionIDService.querySessionID().subscribe(
        sessionID => {
          console.log('Session ID:', sessionID);
          this.sharedService.changeSessionId(sessionID);
        },
        error => {
          console.error('Error getting session ID:', error);
          // Extract the error message from the response
          let errorMessage = error.error.message || 'An unexpected error occurred';
          alert(errorMessage); // Log the error message
          // Optionally, display the error message to the user through UI here
          this.backTohomepage();
          this.reloadPage();
        }
      );
    }

    callUpdatePassword() {
      this.updatePassword();
      console.log('Calling update password : ' + this.inputPassword);
      this.updatePwdService.updatePassword(this.newGenToken, this.inputMobile, this.inputPassword).subscribe(
          response => {
              console.log('Password updated successfully:', response.message); // Assuming response has a message property
              // alert(response.message); // Show success message from response
              this.redirect();
          },
          error => {
              console.error('Error updating password:', error);
              let errorMessage = error.error.error || 'An unexpected error occurred'; // Adjusted to access nested error message
              alert(errorMessage); // Show error message to the user
              this.backTohomepage();
              this.reloadPage();
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
    }

    otpRtnFunction2(data: any){
      this.inputPasswordField = data;
    }


    // auth(){
    //   // this.updatePassword();

    //   if(this.otpPassword == this.inputPassword){

    //     console.log("Passwork is OK, handle update password");
    //     this.callUpdatePassword();
    //   }else{
    //     alert("Login Failed, Please try again");
    //     console.log("Login Failed, delete token and redirect to homepage");
    //     this.deleteUserToken(this.inputMobile);
    //     this.backTohomepage()
    //     this.reloadPage()
    //   }
    // }

    // auth(){
    //   // this.updatePassword();

    //   if(this.otpPassword == this.inputPassword){

    //     console.log("Passwork is OK, handle update password");
    //     this.callUpdatePassword();
    //   }else{
    //     alert("Login Failed, Please try again");
    //     console.log("Login Failed, delete token and redirect to homepage");
    //     this.deleteUserToken(this.inputMobile);
    //     this.backTohomepage()
    //     this.reloadPage()
    //   }
    // }

     onSliderChange(value: number) {
      if (value === 5) {
        this.update();
      }
    }

    sliderUpdate() {
      this.getSessionID()
      this.checkInputType(this.inputField);
      // this.checkEmailValidity(this.inputEmail);
      this.isButtonClicked = true;
      this.sliderflag = true;
  

    }
    


}


