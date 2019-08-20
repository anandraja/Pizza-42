import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-connections',
  templateUrl: './connections.component.html',
  styleUrls: ['./connections.component.css']
})
export class ConnectionsComponent implements AfterViewInit {

  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'google/connections.js';
    this.elementRef.nativeElement.appendChild(s);
  }

}
