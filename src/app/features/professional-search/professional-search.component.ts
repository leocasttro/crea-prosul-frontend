import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';
import { TechnicalService } from '../../core/models/technical-service.model';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArtFormExport } from '../../core/models/art.model';
import { ExcelExportService } from '../../core/services/excel-export.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import { CostumerService } from '../../core/services/costumer.service';
import { Costumer } from '../../core/models/costumer.model';

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

interface ArtRequestData {
  clienteId: number | null;
  coordenadorProjeto: Professional | null;
  nomeEmpresa: string;
  endereco: string;
  cep: string;
  telefone: string;
  cnpj: string;
  resumoContrato: string;
  resumoOrdemServico: string;
  numeroContrato: string;
  numeroOrdemServico: string;
  numeroServico: string;
  inicio: string;
  termino: string;
  valorObraServico: number | null;
  valorTotalContrato: number | null;
  nomeEmpresaObra: string;
  enderecoObra: string;
  cepObra: string;
  telefoneObra: string;
  cnpjObra: string;
}

@Component({
  selector: 'app-professional-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    MatTooltipModule,
    MatIconModule
  ],
  templateUrl: './professional-search.component.html',
  styleUrls: ['./professional-search.component.scss'],
})
export class ProfessionalSearchComponent implements OnInit {
  professionals: Professional[] = [];
  selectedProfessionals: Selection[] = [];
  maxSelections: number = 6;
  units: { codigo: string; descricao: string }[] = [];
  costumers: Costumer[] = [];
  currentStep = 1;
  furthestStep = 1;
  steps = [
    { number: 1, title: 'Contratante', subtitle: 'Etapa 1 de 3' },
    { number: 2, title: 'Contrato', subtitle: 'Etapa 2 de 3' },
    { number: 3, title: 'Serviços', subtitle: 'Etapa 3 de 3' },
  ];
  artData: ArtRequestData = {
    clienteId: null,
    coordenadorProjeto: null,
    nomeEmpresa: '',
    endereco: '',
    cep: '',
    telefone: '',
    cnpj: '',
    resumoContrato: '',
    resumoOrdemServico: '',
    numeroContrato: '',
    numeroOrdemServico: '',
    numeroServico: '',
    inicio: '',
    termino: '',
    valorObraServico: null,
    valorTotalContrato: null,
    nomeEmpresaObra: '',
    enderecoObra: '',
    cepObra: '',
    telefoneObra: '',
    cnpjObra: '',
  };

  constructor(
    private professionalService: ProfessionalService,
    private excelExportService: ExcelExportService,
    private costumerService: CostumerService
  ) {}

  ngOnInit() {
    this.selectedProfessionals = [this.createEmptySelection()];
    this.loadProfessionals();
    this.loadCostumers();
    this.getUnits();
  }

  loadProfessionals() {
    this.professionalService.search().subscribe((data) => {
      this.professionals = data;
    });
  }

  getUnits() {
    this.professionalService.getUnits().subscribe((data) => {
      this.units = data;
    });
  }

  loadCostumers() {
    this.costumerService.getCostumer().subscribe((data) => {
      this.costumers = data;
    });
  }

  createEmptySelection(): Selection {
    return {
      professional: null,
      services: [this.createEmptyService()],
      technicalServices: [],
    };
  }

  get professionalCount(): number {
    return this.selectedProfessionals.length;
  }

  get serviceCount(): number {
    return this.selectedProfessionals.reduce(
      (total, selection) => total + selection.services.length,
      0
    );
  }

  get selectedCostumerName(): string {
    const selected = this.costumers.find(
      (costumer) => costumer.id === this.artData.clienteId
    );

    return selected?.cliente || '';
  }

  get selectedCoordinatorName(): string {
    return this.artData.coordenadorProjeto?.name || '';
  }

  nextStep(): void {
    if (this.currentStep < this.steps.length) {
      this.currentStep += 1;
      this.furthestStep = Math.max(this.furthestStep, this.currentStep);
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep -= 1;
    }
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= this.furthestStep) {
      this.currentStep = step;
    }
  }

  onCostumerChange(clienteId: number | null): void {
    const selected = this.costumers.find((costumer) => costumer.id === clienteId);

    if (selected) {
      this.artData.nomeEmpresaObra = selected.cliente;
      this.artData.enderecoObra = selected.endereco;
      this.artData.cepObra = selected.cep;
      this.artData.telefoneObra = selected.telefone;
      this.artData.cnpjObra = selected.cnpj;
    }
  }

  onCnpjChange(value: string): void {
    this.artData.cnpj = this.formatCnpj(value);
  }

  onCepChange(value: string): void {
    this.artData.cep = this.formatCep(value);
  }

  onTelefoneChange(value: string): void {
    this.artData.telefone = this.formatBrazilPhone(value);
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

  private formatCnpj(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 14);

    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  private formatCep(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 8);

    return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  private formatBrazilPhone(value: string): string {
    const digits = this.onlyDigits(value).slice(0, 11);

    if (digits.length <= 10) {
      return digits
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }

    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  private onlyDigits(value: string): string {
    return (value || '').replace(/\D/g, '');
  }

  getServiceNameForTooltip(service: any, selection: any): string {
    if (!service || !service.service || !selection.technicalServices) {
      return '';
    }
    const foundService = selection.technicalServices.find(
      (s: any) => s.codigoServicoTecnico === service.service
    );
    return foundService ? foundService.nomeServicoTecnico : '';
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
        .getActivitiesByService(selectedService.servicoId)
        .subscribe((res) => {
          // Remove duplicatas com base no ID
          const uniqueActivities = Array.from(
            new Map(
              res.map((item: any) => [item.codigoAtividade, item])
            ).values()
          );
          service.activities = uniqueActivities.map((item: any) => ({
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
    this.selectedProfessionals.push(this.createEmptySelection());
  }

  removeProfessionalSelection() {
    if (this.selectedProfessionals.length > 1) {
      this.selectedProfessionals.pop();
    }
  }

  addService(selection: Selection) {
    selection.services.push(this.createEmptyService());
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

  exportToExcel() {
    const selectedProfessionals = this.buildSelectedProfessionalsForExport();

    const exportData: ArtFormExport = {
      nomeEmpresa: this.artData.nomeEmpresa,
      endereco: this.artData.endereco,
      cep: this.artData.cep,
      telefone: this.artData.telefone,
      cnpj: this.artData.cnpj,
      resumoContrato: this.artData.resumoContrato,
      resumoOrdemServico: this.artData.resumoOrdemServico,
      numeroContrato: this.artData.numeroContrato,
      numeroOrdemServico: this.artData.numeroOrdemServico,
      numeroServico: this.artData.numeroServico,
      inicio: this.artData.inicio,
      termino: this.artData.termino,
      valorObraServico: this.artData.valorObraServico ?? 0,
      valorTotalContrato: this.artData.valorTotalContrato ?? 0,
      coordenadorProjeto: this.selectedCoordinatorName,
      nomeEmpresaObra: this.artData.nomeEmpresaObra,
      enderecoObra: this.artData.enderecoObra,
      cepObra: this.artData.cepObra,
      telefoneObra: this.artData.telefoneObra,
      cnpjObra: this.artData.cnpjObra,
      quantidade: '',
      professionals: selectedProfessionals,
    };

    this.excelExportService.exportArtFormToExcel(exportData);
  }

  private buildSelectedProfessionalsForExport(): ArtFormExport['professionals'] {
    return this.selectedProfessionals.map((selection) => {
      return {
        professional: selection.professional,
        technicalServices: selection.technicalServices,
        services: selection.services.map((service) => {
          const selectedService = selection.technicalServices.find(
            (s) => s.codigoServicoTecnico === service.service
          );

          return {
            service:
              selectedService?.nomeServicoTecnico || service.service || 'N/A',
            codigoServico: service.service || 'N/A',
            quantity: service.quantity,
            unit: service.unit,
            description: service.description,
            activityIds: service.activityIds,
            activities: Array.from(
              new Map(
                service.activities
                  .filter((activity) => service.activityIds.includes(activity.id))
                  .map((activity) => [activity.id, activity])
              ).values()
            ),
          };
        }),
      };
    });
  }
}
