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

interface Selection {
  professional: Professional | null;
  service: string | null;
  technicalServices: TechnicalService[];
  activities: Activity[];
  activityIds: number[];
  quantity: number | null;
  unit: string | null;
  description: string | null;
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
      service: null,
      technicalServices: [],
      activities: [],
      activityIds: [],
      quantity: null,
      unit: null,
      description: null,
    };
  }

  onProfessionalChange(selection: Selection) {
      selection.service = null;
      selection.activities = [];
      selection.activityIds = [];
      selection.quantity = null;
      selection.unit = null;
      selection.description = null;

      if (selection.professional?.formation?.id) {
        this.professionalService
          .getTechnicalServicesByProfessional(selection.professional.formation.id)
          .subscribe((services) => {
            selection.technicalServices = services; // Atribui a lista diretamente
          });
      }
    }

  onServiceChange(selection: Selection) {
    selection.activities = [];
    selection.activityIds = [];
    selection.quantity = null;
    selection.unit = null;
    selection.description = null;

    const selectedService = selection.technicalServices.find(
      (service) => service.codigoServicoTecnico === selection.service
    );

    if (selectedService) {
      this.professionalService.getActivitiesByService(selectedService.id)
        .subscribe((response) => {
          console.log('Atividades brutas:', response);

          selection.activities = response.map((item: any) => ({
            id: Number(item.codigoAtividade),
            name: item.descricaoAtividade,
            code: item.codigoAtividade,
          }));
        });
    }
    // if (selection.service) {
    //   console.log('Código do serviço selecionado:', selection.service.codigoServicoTecnico);
    //   this.professionalService
    //     .getActivitiesByService(selection.service.id)
    //     .subscribe((activities) => {
    //       selection.activities = activities.map(activity => ({
    //         id: activity.id,
    //         name: activity.name || '',
    //         code: activity.code || ''
    //       }));
    //     });
    // }
  }

  getActivityCodes(selection: Selection): string {
    if (!selection.activities || !selection.activityIds?.length) return '';
    const selected = selection.activities.filter((a) =>
      selection.activityIds.includes(a.id)
    );
    return selected.map((a) => a.code).join(', ');
  }

  // getTechnicalServiceCode(selection: Selection): string {
  //   return selection.service?.codigoServicoTecnico || '';
  // }

  addProfessionalSelection() {
    if (this.selectedProfessionals.length < this.maxSelections) {
      this.selectedProfessionals.push(this.createEmptySelection());
    } else {
      alert('Você atingiu o limite máximo de profissionais (6)!');
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
