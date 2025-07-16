import { Professional } from './professional.model';
import { TechnicalService } from './technical-service.model';

export interface ArtFormExport {
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
