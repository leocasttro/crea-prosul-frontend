import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Professional } from '../models/professional.model';
import { environment } from '../../../environments/environment';

interface Activity {
  id: number;
  name: string;
  code: string;
}

interface TechnicalService {
  id: number;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfessionalService {
  private apiUrl = `${environment.apiUrl}/professionals/getAllProfessionals`;

  constructor(private http: HttpClient) {}

  register(professional: Professional): Observable<Professional> {
    return this.http.post<Professional>(this.apiUrl, professional);
  }

  search(): Observable<Professional[]> {
    return this.http.get<Professional[]>(this.apiUrl);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${environment.apiUrl}/activities`);
  }

  getTechnicalServices(): Observable<TechnicalService[]> {
    return this.http.get<TechnicalService[]>(`${environment.apiUrl}/technical-services`);
  }
}
