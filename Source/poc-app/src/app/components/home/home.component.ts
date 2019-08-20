import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { concatMap } from 'rxjs/operators';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'home';

  constructor(public auth: AuthService) { }

  ngOnInit() {
  }
}
