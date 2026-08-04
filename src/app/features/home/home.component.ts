import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  professionals: Professional[] = [];
  searchTerm = '';
  recentArts = [
    {
      code: 'ART-2026-0184',
      status: 'Em análise',
      statusType: 'analysis',
      title: 'Muro de Arrimo de Alvenaria',
      description: 'Prefeitura de Palhoça - Resp. João Silva',
    },
    {
      code: 'ART-2026-0183',
      status: 'Aprovada',
      statusType: 'approved',
      title: 'Laudo Ambiental',
      description: 'Construtora Sul LTDA - Resp. Raimunda N. Sousa',
    },
    {
      code: 'ART-2026-0181',
      status: 'Pendente',
      statusType: 'pending',
      title: 'Projeto de Irrigação',
      description: 'Agro Vale S.A. - Resp. Deivid Pires',
    },
  ];
  quickActions = [
    {
      title: 'Solicitar nova ART',
      description: 'Contrato, serviços e profissionais',
      path: '/professional-search',
    },
    {
      title: 'Cadastrar profissional',
      description: 'Registro, formação e contato',
      path: '/professional-register',
    },
    {
      title: 'Cadastrar cliente',
      description: 'CNPJ, endereço e telefone',
      path: '/costumer-register',
    },
  ];

  constructor(private professionalService: ProfessionalService, private router: Router) {}

  ngOnInit(): void {
    this.professionalService.search().subscribe((data) => {
      this.professionals = data;
    })
  }

  getProfessional(id: number | any): void {
    const professional = this.professionals.find(p => p.id === id);
    this.router.navigate([`/professional-details/${id}`], {
      state: { professional } // Passa o objeto completo
    });
  }

  goToProfessionalRegister(): void {
    this.router.navigate(['/professional-register']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  get registrationCount(): number {
    return this.professionals.filter((professional) => professional.registrationNumber).length;
  }

  get specialtyCount(): number {
    const specialties = this.professionals
      .map((professional) => professional.formation?.nome)
      .filter(Boolean);

    return new Set(specialties).size;
  }

  get filteredProfessionals(): Professional[] {
    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {
      return this.professionals;
    }

    return this.professionals.filter((professional) => {
      const searchable = [
        professional.name,
        professional.registrationNumber,
        professional.formation?.nome,
        professional.contactEmail,
        professional.phoneNumber,
      ].join(' ').toLowerCase();

      return searchable.includes(term);
    });
  }

}
