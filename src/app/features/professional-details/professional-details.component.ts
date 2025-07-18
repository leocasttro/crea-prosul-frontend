import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Professional } from '../../core/models/professional.model';
import { ProfessionalService } from '../../core/services/professional.service';

@Component({
  selector: 'app-professional-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './professional-details.component.html',
  styleUrls: ['./professional-details.component.scss'],
})
export class ProfessionalDetailsComponent implements OnInit {
  professional: Professional | undefined;
  editedProfessional!: Professional;
  isEditing: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private professionalService: ProfessionalService
  ) {}

  ngOnInit() {
    this.professional = history.state.professional;

    if (this.professional) {
      this.editedProfessional = { ...this.professional };
    } else {
      const id = this.route.snapshot.paramMap.get('id');
    }
  }

  startEditing() {
    this.isEditing = true;
    this.editedProfessional = JSON.parse(JSON.stringify(this.professional));
  }

  saveChanges() {
    if (this.editedProfessional && this.professional) {
      this.professional = { ...this.editedProfessional };
      this.professionalService.updateProfessional(this.professional.id, this.editedProfessional).subscribe({
        next: () => {
          this.isEditing = false;
          this.editedProfessional;
        },
        error: (err) => console.error('Error updating professional:', err)
      });
    }
  }

  cancelEditing() {
    this.isEditing = false;
    this.editedProfessional;
  }

  deleteProfessional() {
    if (this.professional && confirm('Tem certeza que deseja excluir este profissional?')) {
      this.professionalService.deleteProfessional(this.professional.id).subscribe({
        next: () => {
          this.professional = undefined;
        },
        error: (err) => console.error('Error deleting professional:', err)
      });
    }
  }
}
