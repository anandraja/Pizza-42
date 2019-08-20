import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.sass']
})
export class CallbackComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    this.auth.handleAuthCallback();
  }

}
