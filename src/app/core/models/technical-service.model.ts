export interface TechnicalService {
  id: number;
  servicoId: number;
  codigoServicoTecnico: string;
  nomeServicoTecnico: string;
  activities: Activity[];
}

export interface Activity {
  id: number;
  name: string;
  code: string;
}
