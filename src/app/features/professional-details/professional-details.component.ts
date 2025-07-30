import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Professional, ProfessionalUpdate } from '../../core/models/professional.model';
import { ProfessionalService } from '../../core/services/professional.service';
import { ToastrService } from 'ngx-toastr';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-professional-details',
  standalone: true,
  imports: [CommonModule, FormsModule, NgSelectModule],
  templateUrl: './professional-details.component.html',
  styleUrls: ['./professional-details.component.scss'],
})
export class ProfessionalDetailsComponent implements OnInit {
  professional: Professional | undefined;
  editedProfessional!: Professional;
  isEditing: boolean = false;
  formations: { id: number; nome: string }[] = [];
  selectedFormationId?: number;

  constructor(
    private route: ActivatedRoute,
    private professionalService: ProfessionalService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.professional = history.state.professional;

    if (this.professional) {
      this.editedProfessional = { ...this.professional };
    } else {
      const id = this.route.snapshot.paramMap.get('id');
    }
    this.getFormation();
  }


  getFormation() {
    this.professionalService.getFormation().subscribe((data) => {
      this.formations = data;
    });
  }

  startEditing() {
    this.isEditing = true;
    this.editedProfessional = JSON.parse(JSON.stringify(this.professional));
    this.selectedFormationId = this.editedProfessional.formation?.id;
  }

  updateFormation() {
    const selectedFormation = this.formations.find(f => f.id === this.selectedFormationId);
    if (selectedFormation) {
      this.editedProfessional.formation = selectedFormation;
    }
  }

  saveChanges() {
    if (this.editedProfessional && this.professional) {
      const updateDTO: ProfessionalUpdate = {
        name: this.editedProfessional.name,
        registrationNumber: this.editedProfessional.registrationNumber,
        cpf: this.editedProfessional.cpf,
        contactEmail: this.editedProfessional.contactEmail,
        phoneNumber: this.editedProfessional.phoneNumber,
        formationId: this.editedProfessional.formation.id
      };
      if (!this.professional.id) {
        this.toastr.error('ID do profissional não encontrado');
        return;
      }

      this.professionalService
        .updateProfessional(this.professional.id, updateDTO)
        .subscribe({
          next: (updatedProfessional: Professional) => {
            this.professional = updatedProfessional;
            this.editedProfessional = { ...updatedProfessional };
            this.selectedFormationId = updatedProfessional.formation?.id;
            this.toastr.info('Usuário atualizado com sucesso');
            this.isEditing = false;
          },
          error: (err) => {
            console.error('Error updating professional:', err);
            this.toastr.error('Erro ao atualizar profissional');
          },
        });
    }
  }

  cancelEditing() {
    this.isEditing = false;
  }

  deleteProfessional() {
    if (
      this.professional &&
      confirm('Tem certeza que deseja excluir este profissional?')
    ) {
      if (!this.professional.id) {
        this.toastr.error('ID do profissional não encontrado');
        return;
      }
      this.professionalService
        .deleteProfessional(this.professional.id)
        .subscribe({
          next: () => {
            this.toastr.show('Profissional excluido com sucesso!');
            this.professional = undefined;
          },
          error: (err) => {
            console.error('Error deleting professional:', err);
            this.toastr.error('Erro ao excluir profissional');
          },
        });
    }
  }
}
