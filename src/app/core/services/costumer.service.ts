import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Costumer } from "../models/costumer.model";

@Injectable({ providedIn: 'root' })
export class CostumerService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCostumer(): Observable<Costumer[]> {
    return this.http.get<Costumer[]>(`${this.baseUrl}/costumer/getAllCostumer`)
  }
}
