import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { ViewportScroller } from '../../node_modules/@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'poc-app';

  constructor(private auth: AuthService, private ViewportScroller: ViewportScroller) { }

  ngOnInit() {
    this.auth.localAuthSetup();
  }
}
