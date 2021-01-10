import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeIndexComponent } from './home-index/home-index.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { NavigationComponent } from './navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthModule, AuthHttpInterceptor } from '@auth0/auth0-angular';
import { LoginComponent } from './login/login.component';
import { TestFunctionComponent } from './test-function/test-function.component';

export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    HomeIndexComponent,
    NavigationComponent,
    LoginComponent,
    TestFunctionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    AuthModule.forRoot({
      domain: '###REPLACEWITHNAME###.us.auth0.com',
      clientId: 'N8RsdGCIP85DoPcc3aFBFc3EV9uf6zfx',
      // Request this audience at user authentication time
      audience: 'https://###REPLACEWITHNAME###.us.auth0.com/api/v2/',

      // Request this scope at user authentication time
      scope: 'read:current_user',

      // Specify configuration for the interceptor              
      httpInterceptor: {
        allowedList: [
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: 'http://localhost:7071/api/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://###REPLACEWITHNAME###.us.auth0.com/api/v2/',

              // The attached token should have these scopes
              scope: 'read:current_user'
            }
          },
          {
            // Match any request that starts 'https://YOUR_DOMAIN/api/v2/' (note the asterisk)
            uri: 'https://###REPLACEWITHNAME###.azurewebsites.net/api/*',
            tokenOptions: {
              // The attached token should target this audience
              audience: 'https://###REPLACEWITHNAME###.us.auth0.com/api/v2/',

              // The attached token should have these scopes
              scope: 'read:current_user'
            }
          }
        ]
      }
    }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["http://localhost:4200/", "https://###REPLACEWITHNAME###.azurewebsites.net/"],
        disallowedRoutes: [],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
