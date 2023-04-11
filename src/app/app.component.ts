import { Component, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import { Restaurateur } from './_services/restaurateur';
import { RestaurateurService } from './_services/restaurateur.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showRestaurateurBoard = false;
  username?: string;
  restaurateurs!: Restaurateur[];
  @Output() logoutEvent = new EventEmitter<void>();
  eventBusSub?: Subscription;
  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private restaurateurService: RestaurateurService
  ) { }
  ngOnInit(): void {
    const token = this.storageService.getToken();
    if (token) {
      this.authService.isLoggedIn.next(true);
      const user = this.storageService.getUser();
      this.roles = user.roles;
      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showRestaurateurBoard = this.roles.includes('ROLE_RISTORATORE');
      this.username = user.username;
    }

    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    this.eventBusService.on('logout', () => {
      this.logout();
    });

    this.restaurateurService.getAllRestaurateurs().subscribe(
      restaurateurs => {
        this.restaurateurs = restaurateurs;
      },
      error => {
        console.log(error);
      }
    );
    let consentStatus = localStorage.getItem('cookie-consent');
    if (consentStatus === null) {
      // Se il valore non è stato ancora impostato, salva la scelta dell'utente
      let cc = window as any;
      cc.cookieconsent.initialise({
        "cookie": {
          "domain": "http://localhost:4200/home"
        },
        "position": "bottom-right",
        "theme": "classic",
        "palette": {
          "popup": {
            "background": "#b6b6b6",
            "text": "#000000",
            "link": "#000000"
          },
          "button": {
            "background": "#ff4500",
            "text": "#ffffff",
            "border": "transparent"
          }
        },
        "type": "info",
        "content": {
          "message": "Questo sito Web utilizza i cookie per migliorare l'esperienza sul nostro sito.",
          "dismiss": "Ho capito",
          "deny": "Refuse cookies",
          "link": "Learn more",
          "href": "https://cookiesandyou.com/",
          "policy": "Cookie Policy"
        },
        onStatusChange: function(status: string) {
          localStorage.setItem('cookie-consent', status);
          consentStatus = status;
        }
      });
    } else {
      // Se il valore è stato già impostato, non fare nulla
    };
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: res => {
        console.log(res);
        this.storageService.clean();

        window.location.reload();
      },
      error: err => {
        console.log(err);
      }
    });
  }
}
