import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurateurService } from 'src/app/_services/restaurateur.service';
import { Restaurateur } from 'src/app/_services/restaurateur';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  restaurateurs!: Restaurateur[];
  @Output() logoutEvent = new EventEmitter<void>();

  eventBusSub?: Subscription;

  constructor(
    private restaurateurService: RestaurateurService
  ) {}

  ngOnInit(): void {
    this.restaurateurService.getAllRestaurateurs().subscribe(
      restaurateurs => {
        this.restaurateurs = restaurateurs;
      },
      error => {
        console.log(error);
      }
    );
  }
}
