export interface CreateExamsRequest {
  name: string;
  analysisId: number;
}

export interface UpdateExamsRequest {
  examId: number;
  name: string;
  analysisId: number;
}
