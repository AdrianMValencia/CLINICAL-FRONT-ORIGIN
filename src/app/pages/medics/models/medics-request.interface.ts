export interface CreateMedicsRequest {
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

export interface UpdateMedicsRequest {
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
