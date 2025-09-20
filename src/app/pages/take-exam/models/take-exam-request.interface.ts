export interface CreateTakeExamRequest {
  patientId: number;
  medicId: number;
  takeExamDetails: CreateTakeExamDetailRequest[];
}

export interface CreateTakeExamDetailRequest {
  examId: number;
  analysisId: number;
}

export interface UpdateTakeExamRequest {
  takeExamId: number;
  patientId: number;
  medicId: number;
  takeExamDetails: UpdateTakeExamDetailRequest[];
}

export interface UpdateTakeExamDetailRequest {
  takeExamDetailId: number;
  examId: number;
  analysisId: number;
}
