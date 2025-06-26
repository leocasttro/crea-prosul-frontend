import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Professional } from '../models/professional.model';

interface Activity {
  id: number;
  name: string;
  code: string;
}

interface TechnicalService {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = 'http://localhost:3000/professionals';

  constructor(private http: HttpClient) {}

  register(professional: Professional): Observable<Professional> {
    return this.http.post<Professional>(this.apiUrl, professional);
  }

  search(): Observable<Professional[]> {
    // Enquanto não existe API, manter comentado
    // return this.http.get<Professional[]>(this.apiUrl);
    return of([
      { id: 1, name: 'João Silva', specialty: 'Engenharia Civil', registrationNumber: '12345', email: 'joao@exemplo.com' },
      { id: 2, name: 'Maria Souza', specialty: 'Engenharia Elétrica', registrationNumber: '67890', email: 'maria@exemplo.com' },
    ]);
  }

  getActivities(): Observable<Activity[]> {
    return of([
      { id: 1, name: 'Projeto Estrutural', code: 'PE-001' },
      { id: 2, name: 'Consultoria', code: 'CO-002' },
      { id: 3, name: 'Fiscalização', code: 'FI-003' },
    ]);
  }

getTechnicalServices(): Observable<TechnicalService[]> {
    // Retorna dados compatíveis com a interface TechnicalService
    return of([
      { id: 1, name: 'Serviço Técnico A', code: 'STA001' },
      { id: 2, name: 'Serviço Técnico B', code: 'STB002' },
      { id: 3, name: 'Serviço Técnico C', code: 'STC003' },
    ]);
  }
}
