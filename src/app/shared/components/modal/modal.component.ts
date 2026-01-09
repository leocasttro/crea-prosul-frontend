import { Component, Inject, OnInit, Optional } from '@angular/core';
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
import {
  MatNativeDateModule,
  MatOption,
  MatOptionSelectionChange,
} from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { CostumerService } from '../../../core/services/costumer.service';
import { Costumer } from '../../../core/models/costumer.model';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
export interface ModalData {
  nomeEmpresa?: string;
  endereco?: string;
  cep?: string;
  telefone?: string;
  cnpj?: string;
  resumoContrato?: string;
  resumoOrdemServico?: string;
  numeroContrato?: string;
  numeroOrdemServico?: string;
  numeroServico?: string;
  inicio?: string;
  termino?: string;
  valorObraServico?: number;
  valorTotalContrato?: number;
  selectedProfessionals?: any;
  nomeEmpresaObra?: string;
  enderecoObra?: string;
  cepObra?: string;
  telefoneObra?: string;
  cnpjObra?: string;
  quantidade?: string;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogActions,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    NgxMaskDirective,
  ],
  providers: [provideNgxMask()],
})
export class ModalComponent implements OnInit {
  modalData!: FormGroup;
  costumers: Costumer[] = [];

  constructor(
    @Optional() public dialogRef: MatDialogRef<ModalComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Partial<ModalData> | null,
    private fb: FormBuilder,
    private costumerService: CostumerService
  ) {}

  loadCostumer() {
    this.costumerService.getCostumer().subscribe((data) => {
      this.costumers = data;
    });
  }

  onSelectCostumer(event: MatOptionSelectionChange): void {
    this.modalData.get('clienteId')!.valueChanges.subscribe((clienteId) => {
      const selected = this.costumers.find((c) => c.id === clienteId);
      console.log(selected);
      if (selected) {
        this.modalData.patchValue({
          nomeEmpresaObra: selected.cliente,
          enderecoObra: selected.endereco,
          cepObra: selected.cep,
          telefoneObra: selected.telefone,
          cnpjObra: selected.cnpj,
        });
      }
    });
  }

  ngOnInit(): void {
    const dialogData: Partial<ModalData> = this.data ?? {};

    this.loadCostumer();

    this.modalData = this.fb.group({
      clienteId: [null, Validators.required],

      nomeEmpresa: [dialogData.nomeEmpresa ?? '', Validators.required],
      endereco: [dialogData.endereco ?? '', Validators.required],
      cep: [dialogData.cep ?? ''],
      telefone: [dialogData.telefone ?? ''],
      cnpj: [dialogData.cnpj ?? ''],

      resumoContrato: [dialogData.resumoContrato ?? '', Validators.required],
      resumoOrdemServico: [
        dialogData.resumoOrdemServico ?? '',
        Validators.required,
      ],

      numeroContrato: [dialogData.numeroContrato ?? '', Validators.required],
      numeroOrdemServico: [
        dialogData.numeroOrdemServico ?? '',
        Validators.required,
      ],
      numeroServico: [dialogData.numeroServico ?? '', Validators.required],

      inicio: [dialogData.inicio ?? '', Validators.required],
      termino: [dialogData.termino ?? '', Validators.required],

      valorObraServico: [dialogData.valorObraServico ?? null],
      valorTotalContrato: [dialogData.valorTotalContrato ?? null],

      nomeEmpresaObra: [''],
      enderecoObra: [''],
      cepObra: [''],
      telefoneObra: [''],
      cnpjObra: [''],
      quantidade: [''],
    });

    this.modalData.get('clienteId')!.valueChanges.subscribe((clienteId) => {
      const selected = this.costumers.find((c) => c.id === clienteId);
      if (selected) {
        this.modalData.patchValue({
          nomeEmpresaObra: selected.cliente,
          enderecoObra: selected.endereco,
          cepObra: selected.cep,
          telefoneObra: selected.telefone,
          cnpjObra: selected.cnpj,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.modalData.valid) {
      const dialogData = this.data ?? {};

      const formData: ModalData = {
        ...this.modalData.value,
        selectedProfessionals: dialogData.selectedProfessionals,
      };

      this.dialogRef?.close(formData);
    } else {
      alert(
        'Por favor, preencha todos os campos obrigatórios antes de enviar.'
      );
    }
  }

  onCancel(): void {
    // **PONTO DE CORREÇÃO 3**: Log para verificar fechamento sem dados
    console.log('Modal fechado sem dados');
    this.dialogRef.close();
  }
}
