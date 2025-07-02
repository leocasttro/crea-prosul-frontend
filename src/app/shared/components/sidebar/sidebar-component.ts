import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-component.html',
  styleUrls: ['./sidebar-component.scss']
})
export class SidebarComponent implements OnInit {
  navItems = [
    { label: 'Início', path: '/home' },
    { label: 'Cadastrar Profissional', path: '/professional-register' }, // Ajustado para corresponder ao app.routes.ts
    { label: 'Consultar código das atividades', path: '/professional-search' }, // Ajustado para corresponder ao app.routes.ts
  ];

  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
          console.log('Usuário carregado no Sidebar:', user);
        },
        error: (err) => {
          console.error('Erro ao carregar usuário no Sidebar:', err);
          this.user = null;
          this.router.navigate(['/login']);
        }
      });
    } else {
      console.log('Usuário não autenticado, pulando chamada a /api/auth/me');
      this.user = null;
      this.router.navigate(['/login']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/login']);
  }

  get hasActiveItem(): boolean {
    return this.navItems.some(item => this.router.url.startsWith(item.path));
  }
}
