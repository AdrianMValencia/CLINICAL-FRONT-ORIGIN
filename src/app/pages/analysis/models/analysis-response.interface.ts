export interface AnalysisResponse {
  analysisId: number;
  name?: string;
  auditCreateDate: Date;
  state: number;
  stateAnalysis?: any;
  icEdit: string;
  icDelete: string;
}

export interface AnalysisByIdResponse {
  analysisId: number;
  name?: string;
}
