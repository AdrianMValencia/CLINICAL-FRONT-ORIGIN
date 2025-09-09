export interface PatientResponse {
  patientId: number;
  names: string;
  surnames: string;
  documentType: string;
  documentNumber: string;
  phone: string;
  age: string;
  gender: string;
  statePatient: any;
  auditCreateDate: string;
  icEdit: string;
  icDelete: string;
}

export interface PatientByIdResponse {
  patientId: number;
  names: string;
  lastName: string;
  motherMaidenName: string;
  documentTypeId: number;
  documentNumber: string;
  phone: string;
  typeAgeId: number;
  age: string;
  genderId: number;
}
