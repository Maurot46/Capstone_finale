import { Component, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent{

  @Output() logoutEvent = new EventEmitter<void>();

  eventBusSub?: Subscription;

  constructor(
  ) { }

  ngOnInit(): void {
  }
}

