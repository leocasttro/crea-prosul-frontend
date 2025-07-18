import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExcelExportService } from '../../../core/services/excel-export.service';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CostumerService } from '../../../core/services/costumer.service';
import { Costumer } from '../../../core/models/costumer.model';

export interface ModalData {
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
  valorObraServico: number;
  valorTotalContrato: number;
  selectedProfessionals?: any;
  nomeEmpresaObra: string,
  enderecoObra: string,
  cepObra: string,
  telefoneObra: string,
  cnpjObra: string,
  quantidade: string
}

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgSelectComponent,
  ],
})
export class ModalComponent implements OnInit {
  modalData!: FormGroup;
  costumers: Costumer[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private fb: FormBuilder,
    private costumerService: CostumerService
  ) {}

  loadCostumer() {
    this.costumerService.getCostumer().subscribe((data) => {
      console.log(data);
      this.costumers = data;
    });
  }

  onSelectCostumer(selected: Costumer): void {
    if (selected) {
      this.modalData.patchValue({
        nomeEmpresaObra: selected.cliente,
        enderecoObra: selected.endereco,
        cepObra: selected.cep,
        telefoneObra: selected.telefone,
        cnpjObra: selected.cnpj,
      });
    }
  }

  ngOnInit(): void {
    this.loadCostumer();
    console.log('Dados recebidos no modal:', this.data);

    this.modalData = this.fb.group({
      nomeEmpresa: [this.data.nomeEmpresa || '', Validators.required],
      endereco: [this.data.endereco || '', Validators.required],
      cep: [this.data.cep || ''],
      telefone: [this.data.telefone || ''],
      cnpj: [this.data.cnpj || ''],
      resumoContrato: [this.data.resumoContrato || '', Validators.required],
      resumoOrdemServico: [this.data.resumoOrdemServico || '', Validators.required],
      numeroContrato: [this.data.numeroContrato || '', Validators.required],
      numeroOrdemServico: [this.data.numeroOrdemServico || '', Validators.required],
      numeroServico: [this.data.numeroServico || '', Validators.required],
      inicio: [this.data.inicio || '', Validators.required],
      termino: [this.data.termino || '', Validators.required],
      valorObraServico: [this.data.valorObraServico || null],
      valorTotalContrato: [this.data.valorTotalContrato || null],

      // Campos da obra que estavam faltando:
      nomeEmpresaObra: [''],
      enderecoObra: [''],
      cepObra: [''],
      telefoneObra: [''],
      cnpjObra: [''],
      quantidade: ['']
    });

  }

  onSubmit(): void {
    if (this.modalData.valid) {
      const formData: ModalData = {
        ...this.modalData.value,
        selectedProfessionals: this.data.selectedProfessionals,
      };
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
