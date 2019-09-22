import { Component, OnInit } from '@angular/core';
import {AuthorizationService} from '../service/authorization.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  getUsername() {
    return localStorage.getItem(AuthorizationService.username);
  }

}
