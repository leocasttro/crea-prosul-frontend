import { Professional } from './professional.model';
import { TechnicalService } from './technical-service.model';

export interface ArtFormExport {
  coordenadorProjeto: string
  nomeEmpresaObra: string
  enderecoObra: string
  cepObra: string
  telefoneObra: string
  cnpjObra: string
  quantidade: string
  nomeEmpresa: string;
  endereco: string;
  cep: string;
  telefone: string;
  cnpj: string;
  resumoContrato: string;
  resumoOrdemServico: string;
  numeroContrato: string;
  numeroOrdemServico: string;
  numeroServico: string;
  inicio: string;
  termino: string;
  valorObraServico: number;
  valorTotalContrato: number;
  professionals: ProfessionalSelection[];
}


export interface ProfessionalSelection {
  professional: Professional | null;
  services: Service[];
  technicalServices: TechnicalService[];
}

export interface Service {
  service: string | null;
  activities: Activity[];
  activityIds: number[];
  quantity: number | null;
  unit: string | null;
  description: string | null;
}

export interface Activity {
  id: number;
  name: string;
  code: string;
}
