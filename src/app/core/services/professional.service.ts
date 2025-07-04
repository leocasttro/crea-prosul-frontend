import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Professional } from '../models/professional.model';
import { environment } from '../../../environments/environment';
import { TechnicalService } from '../models/technical-service.model';

export interface Activity {
  id: number;
  name: string;
  code: string;
}

interface PagedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Busca todos os profissionais.
   */
  search(): Observable<Professional[]> {
    return this.http.get<Professional[]>(`${this.baseUrl}/professionals/getAllProfessionals`);
  }

  getTechnicalServicesByProfessional(professionalId: number): Observable<TechnicalService[]> {
    return this.http.get<TechnicalService[]>(
      `${this.baseUrl}/formation-service-activities/byFormation/${professionalId}`
    );
  }
  /**
   * Atividades fictícias por serviço técnico.
   */
  getActivitiesByService(serviceId: number): Observable<Activity[]> {
    console.log(serviceId)
    return this.http.get<Activity[]>(`${this.baseUrl}/formation-service-activities/byService/${serviceId}/activities`)
    // const mockActivities: Activity[] = [
    //   { id: 201, name: 'Estudo Técnico Preliminar', code: 'AT001' },
    //   { id: 202, name: 'Relatório de Impacto Ambiental', code: 'AT002' },
    //   { id: 203, name: 'Laudo de Estabilidade', code: 'AT003' }
    // ];
    // return of(mockActivities);
  }
}
