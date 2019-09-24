import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import {RouterModule, Routes} from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import {HttpService} from './service/http.service';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHandler} from '@angular/common/http';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {NgxLoadingModule} from 'ngx-loading';
import { ForumComponent } from './forum/forum.component';
import {AuthorizationService} from './service/authorization.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BsDropdownModule, ModalModule, TooltipModule} from 'ngx-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination';
import {DatePipe} from '@angular/common';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'registration', component: RegisterComponent},
  { path: 'forum', component: ForumComponent, canActivate: [AuthorizationService]},
  { path: '**', component: LoginComponent}
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    FooterComponent,
    ForumComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    [RouterModule.forRoot(routes)],
    SimpleNotificationsModule.forRoot({timeOut: 4000, showProgressBar: true}),
    NgxLoadingModule.forRoot({}),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [HttpService, HttpClient, AuthorizationService, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
