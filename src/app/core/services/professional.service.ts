import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Professional } from '../models/professional.model';
import { environment } from '../../../environments/environment';
import { TechnicalService } from '../models/technical-service.model';

export interface Activity {
  id: number;
  name: string;
  code: string;
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

  getActivitiesByService(serviceId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/formation-service-activities/byService/${serviceId}/activities`)
  }

  createProfessional(professional: Professional): Observable<Professional> {
    return this.http.post<Professional>(`${this.baseUrl}/professionals/createProfessionals`, professional)
  }

  updateProfessional(professionalId: number | any, professional: Professional): Observable<Professional> {
    return this.http.put<Professional>(`${this.baseUrl}/professionals/updateProfessional/${professionalId}`, professional).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro completo:', error);
        if (error.status === 401) {
          console.error('Acesso não autorizado. Verifique o token ou permissões.');
        }
        return throwError(() => new Error('Erro ao atualizar profissional: ' + error.message));
      })
    );
  }

  deleteProfessional(professionalId: number | any): Observable<Professional> {
    return this.http.delete<Professional>(`${this.baseUrl}/professionals/deleteProfessional/${professionalId}`)
  }
}
