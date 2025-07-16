import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfessionalService } from '../../core/services/professional.service';
import { Professional } from '../../core/models/professional.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  professionals: Professional[] = [];

  constructor(private professionalService: ProfessionalService, private router: Router) {}

  ngOnInit(): void {
    this.professionalService.search().subscribe((data) => {
      this.professionals = data;
    })
  }

  getProfessional(id: number | any): void {
    const professional = this.professionals.find(p => p.id === id);
    this.router.navigate([`/professional-details/${id}`], {
      state: { professional } // Passa o objeto completo
    });
  }

}
