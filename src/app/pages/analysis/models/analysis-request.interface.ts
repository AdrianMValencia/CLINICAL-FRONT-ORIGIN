export interface CreateAnalysisRequest {
  name?: string;
}

export interface UpdateAnalysisRequest {
  analysisId: number;
  name?: string;
}
