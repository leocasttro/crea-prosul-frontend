import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CostumerService } from '../../core/services/costumer.service';
import { Costumer } from '../../core/models/costumer.model';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-costumer-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './costumer-register.component.html',
  styleUrls: ['./costumer-register.component.scss'],
})
export class CostumerRegisterComponent implements OnInit {
  costumerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private costumerService: CostumerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.costumerForm = this.fb.group({
      cliente: ['', Validators.required],
      endereco: ['', Validators.required],
      cep: ['', Validators.required],
      telefone: ['', Validators.required],
      cnpj: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.costumerForm.valid) {
      const costumerData: Costumer = this.costumerForm.value;
      this.costumerService.createCostumer(costumerData).subscribe({
        next: () => {
          this.toastr.success('Cliente salvo com sucesso!', 'Sucesso');
          this.costumerForm.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastrar cliente:', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error,
          });
          this.toastr.error('Erro ao salvar', 'Error');
        },
      });
    }
  }
}
