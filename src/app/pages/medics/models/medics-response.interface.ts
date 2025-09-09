export interface MedicsResponse {
  medicId: number;
  names: string;
  surnames: string;
  address: string;
  phone: string;
  birthDate: string;
  documentType: string;
  documentNumber: string;
  specialty: string;
  stateMedic: any;
  auditCreateDate: string;
  icEdit: string;
  icDelete: string;
}

export interface MedicsByIdResponse {
  medicId: number;
  names: string;
  lastName: string;
  motherMaidenName: string;
  address: string;
  phone: string;
  birthDate: string;
  documentTypeId: number;
  documentNumber: string;
  specialtyId: number;
}
