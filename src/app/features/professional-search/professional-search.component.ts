import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';
import { TechnicalService } from '../../core/models/technical-service.model';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArtFormExport } from '../../core/models/art.model';
import { ExcelExportService } from '../../core/services/excel-export.service';
import {
  ModalComponent,
  ModalData,
} from '../../shared/components/modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  imports: [CommonModule, FormsModule, NgSelectModule, MatTooltipModule],
  templateUrl: './professional-search.component.html',
  styleUrls: ['./professional-search.component.scss'],
})
export class ProfessionalSearchComponent implements OnInit {
  professionals: Professional[] = [];
  selectedProfessionals: Selection[] = [];
  maxSelections: number = 6;
  units: { codigo: string; descricao: string }[] = [];

  constructor(
    private professionalService: ProfessionalService,
    private excelExportService: ExcelExportService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.selectedProfessionals = [this.createEmptySelection()];
    this.loadProfessionals();
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
    const filteredProfessionals = this.selectedProfessionals.map(
      (selection) => {
        return {
          professional: selection.professional,
          services: selection.services.map((service) => {
            const selectedService = selection.technicalServices.find(
              (s) => s.codigoServicoTecnico === service.service
            );
            return {
              service:
                selectedService?.nomeServicoTecnico || service.service || 'N/A', // Usa o nome do serviço ou fallback
              codigoServico: service.service || 'N/A', // Mantém o código do serviço
              quantity: service.quantity,
              unit: service.unit,
              description: service.description,
              activities: Array.from(
                new Map(
                  service.activities
                    .filter((a) => service.activityIds.includes(a.id))
                    .map((a) => [a.id, a])
                ).values()
              ),
            };
          }),
        };
      }
    );

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        selectedProfessionals: filteredProfessionals,
      },
      width: '1300px',
      maxWidth: '120vw',
    });

    dialogRef
      .afterClosed()
      .subscribe((result: ModalData & { selectedProfessionals: any[] }) => {
        // **PONTO DE CORREÇÃO 2**: Adicionado log para verificar os dados retornados do modal
        console.log(
          'Dados retornados do modal:',
          result?.selectedProfessionals
        );
        if (result) {
          const exportData: ArtFormExport = {
            nomeEmpresa: result.nomeEmpresa,
            endereco: result.endereco,
            cep: result.cep,
            telefone: result.telefone,
            cnpj: result.cnpj,
            resumoContrato: result.resumoContrato,
            resumoOrdemServico: result.resumoOrdemServico,
            numeroContrato: result.numeroContrato,
            numeroOrdemServico: result.numeroOrdemServico,
            numeroServico: result.numeroServico,
            inicio: result.inicio,
            termino: result.termino,
            valorObraServico: result.valorObraServico,
            valorTotalContrato: result.valorTotalContrato,
            coordenadorProjeto: 'teste',
            nomeEmpresaObra: result.nomeEmpresaObra,
            enderecoObra: result.enderecoObra,
            cepObra: result.cepObra,
            telefoneObra: result.telefoneObra,
            cnpjObra: result.cnpjObra,
            quantidade: result.quantidade,
            professionals: result.selectedProfessionals, // Usa os dados retornados do modal
          };

          this.excelExportService.exportArtFormToExcel(exportData);
        }
      });
  }
}
