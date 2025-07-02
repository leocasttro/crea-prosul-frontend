import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-professional-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './professional-register.component.html',
  styleUrls: ['./professional-register.component.scss']
})
export class ProfessionalRegisterComponent implements OnInit {
  professionalForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.professionalForm = this.fb.group({
      nome: ['', Validators.required],
      registro: ['', Validators.required],
      formacao: ['', Validators.required],
      email: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.professionalForm.valid) {
      console.log('Professional', this.professionalForm.value);
      alert('Profissional cadastrado com sucesso!');
      this.professionalForm.reset();
    }
  }
}
