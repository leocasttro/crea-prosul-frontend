import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';
import { TechnicalService } from '../../core/models/technical-service.model';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormArray } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select'; // Importe o módulo do ng-select

interface Activity {
  id: number;
  name: string;
  code: string;
}

interface Selection {
  professional: Professional | null;
  activity: Activity | null;
  technicalServiceIds: number[] | null; // Ajustado para array de IDs
  quantity: number | null; // Inicializado como number ou null
  unit: string | null;
  description: string | null;
}

@Component({
  selector: 'app-professional-search',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule], // Adicione NgSelectModule
  templateUrl: './professional-search.component.html',
  styleUrls: ['./professional-search.component.scss'],
})
export class ProfessionalSearchComponent implements OnInit {
  professionals: Professional[] = [];
  selectedProfessionals: Selection[] = [];
  activities: Activity[] = [];
  technicalServices: TechnicalService[] = [];
  maxSelections: number = 6;

  constructor(private fb: FormBuilder, private professionalService: ProfessionalService) {}

  ngOnInit() {
    this.selectedProfessionals = [this.createEmptySelection()];
    this.loadProfessionals();
    this.loadActivities();
    this.loadTechnicalServices();
  }

  loadProfessionals() {
    this.professionalService.search().subscribe((data) => {
      this.professionals = data;
    });
  }

  loadActivities() {
    this.professionalService.getActivities().subscribe((data) => {
      this.activities = data;
    });
  }

  loadTechnicalServices() {
    this.professionalService.getTechnicalServices().subscribe((data) => {
      this.technicalServices = data;
      console.log('TechnicalServices mapeados:', this.technicalServices);
    });
  }

  createEmptySelection(): Selection {
    return {
      professional: null,
      activity: null,
      technicalServiceIds: [], // Inicializado como array vazio
      quantity: null, // Inicializado como null
      unit: null,
      description: null,
    };
  }

  onProfessionalChange(selection: Selection) {
    selection.activity = null;
    selection.technicalServiceIds = [];
    selection.quantity = null;
    selection.unit = null;
    selection.description = null;
  }

  onActivityChange(selection: Selection) {
    selection.technicalServiceIds = [];
    selection.quantity = null;
    selection.unit = null;
    selection.description = null;
  }

  getTechnicalServiceCodes(selection: Selection): string {
    if (!selection.technicalServiceIds || !this.technicalServices) return '';
    const services = this.technicalServices.filter(ts => selection.technicalServiceIds!.includes(ts.id));
    return services.map(service => service.code || 'Sem código').join(', ') || '';
  }

  addProfessionalSelection() {
    if (this.selectedProfessionals.length < this.maxSelections) {
      this.selectedProfessionals.push(this.createEmptySelection());
    } else {
      console.warn('Limite máximo de profissionais atingido!');
      alert('Você atingiu o limite máximo de profissionais (6)!');
    }
  }

  removeSelection(index: number) {
    if (this.selectedProfessionals.length > 1) {
      this.selectedProfessionals.splice(index, 1);
    }
  }

  trackByIndex(index: number) {
    return index;
  }
}
