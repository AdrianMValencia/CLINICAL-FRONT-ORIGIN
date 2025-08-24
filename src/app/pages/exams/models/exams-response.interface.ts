export interface ExamsResponse {
  examId: number;
  name: string;
  analysis: string;
  auditCreateDate: string;
  stateExam: any;
  icEdit: string;
  icDelete: string;
}

export interface ExamsByIdResponse {
  examId: number;
  name: string;
  analysisId: number;
}
