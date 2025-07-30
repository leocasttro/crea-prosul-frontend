export interface Formation {
  id: number;
  nome: string;
}

export interface Professional {
  id?: number;
  registrationNumber: string;
  name: string;
  cpf: string;
  formation: Formation;
  contactEmail?: string;
  phoneNumber?: string;
}

export interface ProfessionalUpdate {
  id?: number;
  name?: string;
  registrationNumber?: string;
  cpf?: string;
  contactEmail?: string;
  phoneNumber?: string;
  formationId?: number
}
