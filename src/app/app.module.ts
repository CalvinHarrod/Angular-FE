import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CaptchaComponent } from './captcha/captcha.component';

import { RecaptchaModule } from 'ng-recaptcha';
import { OtpComponent } from './otp/otp.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS  } from '@angular/common/http';
import { FailWebpageComponent } from './fail-webpage/fail-webpage.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { FormControl, Validators } from '@angular/forms';
import { TokenService } from './services/token.service';

@NgModule({
  declarations: [
    AppComponent,
    CaptchaComponent,
    OtpComponent,
    FailWebpageComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgOtpInputModule,
    RecaptchaModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
   
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
