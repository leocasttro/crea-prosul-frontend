import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  professionals: Professional[] = [];

  constructor(private professionalService: ProfessionalService) {}

  ngOnInit(): void {
    this.professionalService.search().subscribe((data) => {
      this.professionals = data;
    })
  }
}
