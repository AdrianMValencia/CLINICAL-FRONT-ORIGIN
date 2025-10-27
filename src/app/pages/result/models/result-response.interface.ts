export interface ResultResponse {
    resultId: number;
    patient: string;
    patientDocument: string;
    auditCreateDate: string;
    stateResult: any;
    icEdit: string;
}

export interface ResultByIdResponse {
    resultId: number | null;
    takeExamId: number | null;
    resultDetails: ResultDetailByResultIdResponse[] | null;
}

export interface ResultDetailByResultIdResponse {
    resultDetailId: number | null;
    resultId: number | null;
    resultFile: string | null;
    takeExamDetailId: number | null;
}

export interface TakeExamDetailAnalysisByTakeExamResponse {
    takeExamDetailId: number;
    analysis: string;
}