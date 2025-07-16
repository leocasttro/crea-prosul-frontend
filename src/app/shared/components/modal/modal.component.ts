import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ExcelExportService } from '../../../core/services/excel-export.service';
import { NgSelectComponent } from "@ng-select/ng-select";

export interface ModalData {
  nomeEmpresa: string;
  endereco: string;
  cep: string;
  telefone: string;
  cnpj: string;
  resumoContrato: string;
  resumoOrdemServico: string
  numeroContrato: string;
  numeroOrdemServico: string;
  numeroServico: string;
  inicio: string;
  termino: string;
  valorObraServico: number;
  valorTotalContrato: number;
  selectedProfessionals?: any;
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
    NgSelectComponent
]
})
export class ModalComponent implements OnInit {
  modalData!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private fb: FormBuilder,
    private excelExportService: ExcelExportService
  ) {}

  ngOnInit(): void {
    this.modalData = this.fb.group({
      nomeEmpresa: [this.data.nomeEmpresa || '', Validators.required],
      endereco: [this.data.endereco || '', Validators.required],
      cep: [this.data.cep || '', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
      telefone: [this.data.telefone || '', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      cnpj: [this.data.cnpj || '', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]],
      resumoContrato: [this.data.resumoContrato || '', Validators.required],
      resumoOrdemServico: [this.data.resumoOrdemServico || '', Validators.required],
      numeroContrato: [this.data.numeroContrato || '', Validators.required],
      numeroOrdemServico: [this.data.numeroOrdemServico || '', Validators.required],
      numeroServico: [this.data.numeroServico || '', Validators.required],
      inicio: [this.data.inicio || '', Validators.required],
      termino: [this.data.termino || '', Validators.required],
      valorObraServico: [this.data.valorObraServico || null, [Validators.required, Validators.min(0)]],
      valorTotalContrato: [this.data.valorTotalContrato || null, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.modalData.valid) {
      const formData: ModalData = {
        ...this.modalData.value,
        selectedProfessionals: this.data.selectedProfessionals
      };
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
