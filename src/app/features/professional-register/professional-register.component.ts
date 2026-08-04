import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ProfessionalService } from "../../core/services/professional.service";
import { Professional } from "../../core/models/professional.model";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrService } from "ngx-toastr";
import {MatIconModule} from '@angular/material/icon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-professional-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule, MatIconModule],
  templateUrl: './professional-register.component.html',
  styleUrls: ['./professional-register.component.scss']
})
export class ProfessionalRegisterComponent implements OnInit {
  professionalForm!: FormGroup;
  formations: { id: number; nome: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private professionalService:
    ProfessionalService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.professionalForm = this.fb.group({
      name: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      formationId: [null, Validators.required],
      cpf: ['', Validators.required],
      contactEmail: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
    this.getFormation()
  }

getFormation() {
  this.professionalService.getFormation().subscribe((data) => {
    this.formations = data;
  });
}

  onSubmit(): void {
    if (this.professionalForm.valid) {
      const professionalData: Professional = this.professionalForm.value;
      this.professionalService.createProfessional(professionalData).subscribe({
        next: () => {
          this.toastr.success('Profissional salvo com sucesso!', 'Sucesso');
          this.professionalForm.reset();
        },
        error: (err) => {
          console.error('Erro ao cadastarar professional', {
            status: err.status,
            statusText: err.statusText,
            message: err.message,
            error: err.error,
          });
          this.toastr.error('Erro ao tentar cadastrar!', 'Error');
        },
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }
}
