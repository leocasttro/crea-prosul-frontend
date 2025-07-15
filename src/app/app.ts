import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./shared/components/sidebar/sidebar-component";
import { AuthService } from './core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'crea-prosul';

  isAuthenticated = false;
  isLoginRoute = false;
  isCollapsed = false;

  constructor(private authService: AuthService, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  onSidebarToggle(collapsed: boolean) {
    this.isCollapsed = collapsed;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isAuthenticated = this.authService.isAuthenticated();
      this.isLoginRoute = this.router.url === '/login';

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.isAuthenticated = this.authService.isAuthenticated();
        this.isLoginRoute = this.router.url === '/login';
      })
    } else {
      console.log('SSR: inicialidado APP sem verificaçção de autenticação')
    }
  }
}
