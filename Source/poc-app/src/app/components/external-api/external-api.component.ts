import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css']
})
export class ExternalApiComponent implements OnInit, OnDestroy {
  responseJson: string;
  pastOrdersSub: Subscription;

  constructor(private api: ApiService) { }

  ngOnInit() {
  }

  getPastOrders() {
    this.pastOrdersSub = this.api.getPastOrders$().subscribe(
      res => {
        this.responseJson = res;
      }
    );
  }

  ngOnDestroy() {
    if (this.pastOrdersSub) {
      this.pastOrdersSub.unsubscribe();
    }
  }

}
