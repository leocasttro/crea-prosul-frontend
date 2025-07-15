import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-costumer-register',
  standalone: true,
  templateUrl: './costumer-register.component.html',
  styleUrls: ['./costumer-register.component.scss'],
})

export class CostumerRegisterComponent {
  costumerForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.costumerForm = this.fb.group({
      nome: ['', Validators.required],
      registro: ['', Validators.required],
      formacao: ['', Validators.required],
      email: ['', Validators.required],
      telefone: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.costumerForm.valid) {
      console.log('Costumer', this.costumerForm.value);
      alert('Cliente cadastrado com sucesso!');
      this.costumerForm.reset();
    }
  }
}
