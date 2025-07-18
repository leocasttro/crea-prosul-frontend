import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProfessionalService } from "../../core/services/professional.service";
import { Professional } from "../../core/models/professional.model";

@Component({
  selector: 'app-professional-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './professional-register.component.html',
  styleUrls: ['./professional-register.component.scss']
})
export class ProfessionalRegisterComponent implements OnInit {
  professionalForm!: FormGroup;

  constructor(private fb: FormBuilder, private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.professionalForm = this.fb.group({
      nome: ['', Validators.required],
      registro: ['', Validators.required],
      formacao: ['', Validators.required],
      cpf: ['', Validators.required],
      email: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.professionalForm.valid) {
      const professionalData: Professional = this.professionalForm.value;
      this.professionalService.createProfessional(professionalData).subscribe({
        next: () => {
          this.professionalForm.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastarar professional', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error,
          });
          alert('Erro ao cadastar professional')
        },
      });
    } else {
      alert('Preencha todos os dados');
    }
  }
}
