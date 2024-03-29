import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { PrivacyComponent } from './privacy/privacy.component';
import { ContactComponent } from './contact/contact.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FaqComponent } from './faq/faq.component';
import { NgxScrollTopModule } from 'ngx-scrolltop';
import { FormsModule } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { ErrorHandlerInterceptor } from './shared/interceptors/error-handler.interceptor';
import { JwtModule } from "@auth0/angular-jwt";
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AgmCoreModule } from '@agm/core';
import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { WithCredentialsInterceptor } from './shared/interceptors/with-credentials.interceptor';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    AppComponent,
    PrivacyComponent,
    ContactComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
    NgxScrollTopModule,
    AgmCoreModule.forRoot({
      apiKey: 'YOUR-API-KEY-HERE'
    }),
    FormsModule,
    RecaptchaV3Module,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001", "simplyrecipes.azurewebsites.net"]
      }
    }),
    SocialLoginModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
  {
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: environment.recaptcha.siteKey,
  },
  { 
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandlerInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: WithCredentialsInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
  ReCaptchaV3Service],
  bootstrap: [AppComponent]
})
export class AppModule { }
