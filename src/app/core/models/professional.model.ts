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
