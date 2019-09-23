import { Component, OnInit } from '@angular/core';
import {HttpService} from '../service/http.service';
import {Router} from '@angular/router';
import {NotificationsService} from 'angular2-notifications';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

  loading = false;

  username = '';
  password = '';

  constructor(private httpService: HttpService,
              private router: Router,
              private notificationService: NotificationsService) { }

  ngOnInit() {
  }

  register() {
    const body: any = {};
    body.username = this.username;
    body.password = this.password;
    this.loading = true;
    this.httpService.register(body).subscribe(response => {
      if(response) {
        this.router.navigate(['/login']);
        this.notificationService.create('Registration completed', 'User was succesfully created.');
        this.loading = false;
      } else {
        this.notificationService.error('Error', 'User wasn\'t created. Please try another username.');
        this.loading = false;
      }
    }, err => {
      this.loading = false;
    });
  }

}
