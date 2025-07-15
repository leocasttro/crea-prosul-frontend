import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Professional } from '../../core/models/professional.model';
import { ProfessionalService } from '../../core/services/professional.service';

@Component({
  selector: 'app-professional-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-details.html',
  styleUrls: ['./professional-details.scss'],
})
export class ProfessionalDetails implements OnInit {
  professional: Professional | undefined;

  constructor(
    private route: ActivatedRoute,
    private professionalService: ProfessionalService
  ) {}
  ngOnInit() {
    this.professional = history.state.professional; // Dados do state
    if (!this.professional) {
    }
  }
}
