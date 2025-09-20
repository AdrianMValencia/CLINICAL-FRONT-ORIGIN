export interface TakeExamResponse {
  takeExamId: number;
  patient: string;
  medic: string;
  stateTakeExam: any;
  auditCreateDate: string;
  icEdit: string;
}

export interface TakeExamByIdResponse {
  takeExamId: number;
  patientId: number;
  medicId: number;
  takeExamDetails: TakeExamByIdDetailResponse[];
}

export interface TakeExamByIdDetailResponse {
  takeExamDetailId: number;
  takeExamId: number;
  examId: number;
  analysisId: number;
}
