import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BaseApiResponse, PaginatedApiResponse } from '@shared/models/commons/base-api-response.interface';
import { endpoint } from '@shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@shared/utils/functions.util';
import { map, Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment.development';
import { CreateResultRequest, UpdateResultRequest } from '../models/result-request.interface';
import { ResultByIdResponse, ResultResponse, TakeExamDetailAnalysisByTakeExamResponse } from '../models/result-response.interface';

@Injectable({
  providedIn: 'root'
})
export class Result {

  private readonly httpClient = inject(HttpClient);

  getAll(
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    getInputs?: any
  ): Observable<PaginatedApiResponse<ResultResponse>> {
    const requestUrl = `${env.api}${endpoint.LIST_RESULTS}?PageNumber=${pageNumber}&PageSize=${pageSize}${getInputs}`;

    return this.httpClient
      .get<PaginatedApiResponse<ResultResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (result: ResultResponse) {
            result.stateResult = getStateBadge(result.stateResult);
            result.icEdit = getIcon(
              'edit',
              'Actualizar resultado',
              true
            );
          });
          return resp;
        })
      );
  }
  private readonly resultByIdSignal = signal<ResultByIdResponse | null>(null);
  private readonly resultCreateSignal = signal<boolean | null>(null);
  private readonly resultUpdateSignal = signal<boolean | null>(null);
  public readonly takeExamDetailAnalysisByTakeExamSignal = signal<TakeExamDetailAnalysisByTakeExamResponse[] | null>(null);

  resultById(resultId: number): void {
    const requestUrl = `${env.api}${endpoint.RESULT_BY_ID}${resultId}`;
    this.httpClient
      .get<BaseApiResponse<ResultByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.resultByIdSignal.set(data);
      });
  }

  takeExamsDetailAnalysisByTakeExam(takeExamId: number): void {
    const requestUrl = `${env.api}${endpoint.TAKE_EXAM_DETAILS_BY_TAKE_EXAM}${takeExamId}`;
    this.httpClient
      .get<BaseApiResponse<TakeExamDetailAnalysisByTakeExamResponse[]>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.takeExamDetailAnalysisByTakeExamSignal.set(data);
      });
  }

  resultCreate(result: CreateResultRequest): void {
    const requestUrl = `${env.api}${endpoint.RESULT_CREATE}`;
    this.httpClient
      .post<BaseApiResponse<boolean>>(requestUrl, result)
      .subscribe((resp) => {
        this.resultCreateSignal.set(resp.isSuccess);
      });
  }

  resultUpdate(result: UpdateResultRequest): void {
    const requestUrl = `${env.api}${endpoint.RESULT_UPDATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, result)
      .subscribe((resp) => {
        this.resultUpdateSignal.set(resp.isSuccess);
      });
  }

  getResultByIdSignal = this.resultByIdSignal.asReadonly();
  getResultCreateSignal = this.resultCreateSignal.asReadonly();
  getResultUpdateSignal = this.resultUpdateSignal.asReadonly();
  getTakeExamDetailAnalysisByTakeExamSignal = this.takeExamDetailAnalysisByTakeExamSignal.asReadonly();
}
