import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseApiResponse, PaginatedApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import { Alert } from '@app/shared/services/alert';
import { DefaultTable } from '@app/shared/services/default-table';
import { endpoint } from '@app/shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@app/shared/utils/functions.util';
import { environment as env } from '@env/environment.development';
import { map, Observable } from 'rxjs';
import {
  CreateAnalysisRequest,
  UpdateAnalysisRequest,
} from '../models/analysis-request.interface';
import {
  AnalysisByIdResponse,
  AnalysisResponse,
} from '../models/analysis-response.interface';

@Injectable({
  providedIn: 'root',
})
export class Analysis extends DefaultTable {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(Alert);

  getAll(
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    getInputs?: any
  ): Observable<PaginatedApiResponse<AnalysisResponse>> {
    const requestUrl = `${env.api}${endpoint.LIST_ANALYSIS}?PageNumber=${pageNumber}&PageSize=${pageSize}`;

    return this.httpClient
      .get<PaginatedApiResponse<AnalysisResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (analysis: AnalysisResponse) {
            analysis.stateAnalysis = getStateBadge(analysis.stateAnalysis);
            analysis.icEdit = getIcon('edit', 'Actualizar Análisis', true);
            analysis.icDelete = getIcon('delete', 'Eliminar Análisis', true);
          });
          return resp;
        })
      );
  }

  analysisById(analysisId: number): Observable<AnalysisByIdResponse> {
    const requestUrl = `${env.api}${endpoint.ANALYSIS_BY_ID}/${analysisId}`;
    return this.httpClient
      .get<BaseApiResponse<AnalysisByIdResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          return resp.data;
        })
      );
  }

  analysisCreate(
    analysis: CreateAnalysisRequest
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.ANALYSIS_CREATE}`;
    return this.httpClient.post<BaseApiResponse<boolean>>(requestUrl, analysis);
  }

  analysisUpdate(
    analysis: UpdateAnalysisRequest
  ): Observable<BaseApiResponse<boolean>> {
    const requestUrl = `${env.api}${endpoint.ANALYSIS_UPDATE}`;
    return this.httpClient.put<BaseApiResponse<boolean>>(requestUrl, analysis);
  }

  analysisDelete(analysisId: number): Observable<void> {
    const requestUrl = `${env.api}${endpoint.ANALYSIS_DELETE}/${analysisId}`;
    return this.httpClient.delete<BaseApiResponse<boolean>>(requestUrl).pipe(
      map((resp: BaseApiResponse<boolean>) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
        }
      })
    );
  }
}
