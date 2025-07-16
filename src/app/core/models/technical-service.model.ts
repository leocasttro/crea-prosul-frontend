export interface TechnicalService {
  id: number;
  codigoServicoTecnico: string;
  nomeServicoTecnico: string;
  activities: Activity[];
}

export interface Activity {
  id: number;
  name: string;
  code: string;
}
