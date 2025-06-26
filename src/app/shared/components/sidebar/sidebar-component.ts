import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

interface User {
  name: string;
  profileImageUrl?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-component.html',
  styleUrls: ['./sidebar-component.scss'],
})
export class SidebarComponent {
  navItems = [
    { label: 'Início', path: '/home' },
    { label: 'Cadastrar Profissional', path: '/register' },
    { label: 'Consultar código das atividades', path: '/search' },
  ];

  user: User | null = null;

  constructor(public router: Router, private authService: AuthService) {
    // Subscreve ao usuário logado
    this.authService.getCurrentUser().subscribe((user) => {
      this.user = user;
    });
  }

  get hasActiveItem(): boolean {
    return this.navItems.some(item => this.router.url.startsWith(item.path));
  }
}
