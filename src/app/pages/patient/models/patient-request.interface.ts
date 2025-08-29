export interface CreatePatientRequest {
  names: string;
  lastName: string;
  motherMaidenName: string;
  documentTypeId: number;
  documentNumber: string;
  phone: string;
  typeAgeId: number;
  age: number;
  genderId: number;
}

export interface UpdatePatientRequest {
  patientId: number;
  names: string;
  lastName: string;
  motherMaidenName: string;
  documentTypeId: number;
  documentNumber: string;
  phone: string;
  typeAgeId: number;
  age: number;
  genderId: number;
}
