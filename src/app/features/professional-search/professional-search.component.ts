import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';
import { TechnicalService } from '../../core/models/technical-service.model';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

interface Activity {
  id: number;
  name: string;
  code: string;
}

interface Service {
  service: string | null;
  activities: Activity[];
  activityIds: number[];
  quantity: number | null;
  unit: string | null;
  description: string | null;
}

interface Selection {
  professional: Professional | null;
  services: Service[];
  technicalServices: TechnicalService[];
}

@Component({
  selector: 'app-professional-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './professional-search.component.html',
  styleUrls: ['./professional-search.component.scss'],
})
export class ProfessionalSearchComponent implements OnInit {
  professionals: Professional[] = [];
  selectedProfessionals: Selection[] = [];
  maxSelections: number = 6;

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit() {
    this.selectedProfessionals = [this.createEmptySelection()];
    this.loadProfessionals();
  }

  loadProfessionals() {
    this.professionalService.search().subscribe((data) => {
      this.professionals = data;
    });
  }

  createEmptySelection(): Selection {
    return {
      professional: null,
      services: [this.createEmptyService()],
      technicalServices: [],
    };
  }

  createEmptyService(): Service {
    return {
      service: null,
      activities: [],
      activityIds: [],
      quantity: null,
      unit: null,
      description: null,
    };
  }

  onProfessionalChange(selection: Selection) {
    selection.services = [this.createEmptyService()];
    selection.technicalServices = [];

    if (selection.professional?.formation?.id) {
      this.professionalService
        .getTechnicalServicesByProfessional(selection.professional.formation.id)
        .subscribe((services) => {
          selection.technicalServices = services;
        });
    }
  }

  onServiceChange(service: Service, selection: Selection) {
    service.activities = [];
    service.activityIds = [];
    service.quantity = null;
    service.unit = null;
    service.description = null;

    const selectedService = selection.technicalServices.find(
      (s) => s.codigoServicoTecnico === service.service
    );

    if (selectedService) {
      this.professionalService
        .getActivitiesByService(selectedService.id)
        .subscribe((res) => {
          service.activities = res.map((item: any) => ({
            id: Number(item.codigoAtividade),
            name: item.descricaoAtividade,
            code: item.codigoAtividade,
          }));
        });
    }
  }

  getActivityCodes(service: Service): string {
    if (!service.activities || !service.activityIds?.length) return '';
    return service.activityIds
      .map((id) => service.activities.find((a) => a.id === id)?.code || '')
      .filter((code) => !!code)
      .join(', ');
  }

  addProfessionalSelection() {
    if (this.selectedProfessionals.length < this.maxSelections) {
      this.selectedProfessionals.push(this.createEmptySelection());
    } else {
      alert('Você atingiu o limite máximo de profissionais (6)!');
    }
  }

  removeProfessionalSelection() {
    if (this.selectedProfessionals.length > 1) {
      this.selectedProfessionals.pop();
    }
  }

  addService(selection: Selection) {
    if (selection.services.length < 6) {
      selection.services.push(this.createEmptyService());
    } else {
      alert('Você atingiu o limite máximo de 6 serviços para este profissional!');
    }
  }

  removeService(selection: Selection, index: number) {
    if (selection.services.length > 1) {
      selection.services.splice(index, 1);
    }
  }

  removeSelection(index: number) {
    if (this.selectedProfessionals.length > 1) {
      this.selectedProfessionals.splice(index, 1);
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}
