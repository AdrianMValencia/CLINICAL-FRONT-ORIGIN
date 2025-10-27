export interface CreateResultRequest {
    takeExamId: number;
    resultDetails: CreateResultDetailRequest[];
}

export interface CreateResultDetailRequest {
    resultFile: string | null;
    takeExamDetailId: number;
}

export interface UpdateResultRequest {
    resultId: number;
    takeExamId: number;
    resultDetails: UpdateResultDetailRequest[];
}

export interface UpdateResultDetailRequest {
    resultDetailId: number;
    resultId: number | null;
    resultFile: string | null;
    takeExamDetailId: number;
}