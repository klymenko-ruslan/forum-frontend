import { Component, OnInit } from '@angular/core';
import {HttpService} from '../service/http.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';
import {AuthorizationService} from '../service/authorization.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loading = false;

  username = '';
  password = '';


  constructor(private httpService: HttpService,
              private router: Router,
              private notificationService: NotificationsService,
              private authorizationService: AuthorizationService) { }

  ngOnInit() {
  }

  login() {
    const body: any = {};
    body.username = this.username;
    body.password = this.password;
    this.loading = true;
    this.httpService.login(body).subscribe((response: string) => {
      if (response) {
        this.router.navigate(['/forum']);
        this.loading = false;
        this.authorizationService.login(response);
      } else {
        this.notificationService.error('Error', 'Login failed.');
        this.loading = false;
      }
    }, err => {
      alert(JSON.stringify(err));
    });
  }

}
