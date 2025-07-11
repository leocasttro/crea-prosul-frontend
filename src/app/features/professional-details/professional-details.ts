import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-professional-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-details.html',
  styleUrls: ['./professional-details.scss']
})

export class ProfessionalDetails implements OnInit {

  ngOnInit(): void {

  }
}
