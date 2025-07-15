import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './sidebar-component.html',
  styleUrls: ['./sidebar-component.scss']
})
export class SidebarComponent implements OnInit {
  navItems = [
  { label: 'Início', icon: 'home', path: '/home' },
  { label: 'Cadastrar Profissional', icon: 'person_add', path: '/professional-register' },
  { label: 'Cadastrar Cliente', icon: 'groups', path: '/costumer-register' },
  { label: 'Solicitar ART', icon: 'assignment', path: '/professional-search' },
];

  isCollapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();


toggleSidebar(): void {
  this.isCollapsed = !this.isCollapsed;
  this.collapsedChange.emit(this.isCollapsed); // <-- Aqui envia para o pai
}


  user: User | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (err) => {
          console.error('Erro ao carregar usuário no Sidebar:', err);
          this.user = null;
          this.router.navigate(['/login']);
        }
      });
    } else {
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
