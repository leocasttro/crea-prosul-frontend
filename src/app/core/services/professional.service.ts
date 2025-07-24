import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Formation, Professional } from '../models/professional.model';
import { environment } from '../../../environments/environment';
import { TechnicalService } from '../models/technical-service.model';
import { Units } from '../models/units.model';

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


  getUnits(): Observable<Units[]> {
    return this.http.get<Units[]>(`${this.baseUrl}/units/allUnit`)
  }
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

  getFormation(): Observable<Formation[]> {
    return this.http.get<Formation[]>(`${this.baseUrl}/professionals/getAllFormation`)
  }

  getActivitiesByService(serviceId: number): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.baseUrl}/formation-service-activities/byService/${serviceId}/activities`)
  }

  createProfessional(professional: Professional): Observable<Professional> {
    return this.http.post<Professional>(`${this.baseUrl}/professionals/createProfessional`, professional)
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


  getAllProfessionals(): Observable<{id: string}[]> {
    return this.http.get<{id: string}[]>(`${this.baseUrl}/professionals/getAllProfessionals`)
  }
}
