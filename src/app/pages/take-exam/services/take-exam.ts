import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment as env } from '@env/environment.development';
import {
  BaseApiResponse,
  PaginatedApiResponse,
} from '@shared/models/commons/base-api-response.interface';
import { Alert } from '@shared/services/alert';
import { endpoint } from '@shared/utils/endpoints.util';
import { getIcon, getStateBadge } from '@shared/utils/functions.util';
import { map, Observable } from 'rxjs';
import {
  CreateTakeExamRequest,
  UpdateTakeExamRequest,
} from '../models/take-exam-request.interface';
import {
  TakeExamByIdResponse,
  TakeExamResponse,
} from '../models/take-exam-response.interface';

@Injectable({
  providedIn: 'root',
})
export class TakeExam {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(Alert);

  getAll(
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    getInputs?: any
  ): Observable<PaginatedApiResponse<TakeExamResponse>> {
    const requestUrl = `${env.api}${endpoint.LIST_TAKE_EXAM}?PageNumber=${pageNumber}&PageSize=${pageSize}${getInputs}`;

    return this.httpClient
      .get<PaginatedApiResponse<TakeExamResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (takeExam: TakeExamResponse) {
            takeExam.stateTakeExam = getStateBadge(takeExam.stateTakeExam);
            takeExam.icEdit = getIcon(
              'edit',
              'Actualizar examen realizado',
              true
            );
          });
          return resp;
        })
      );
  }
  private readonly takeExamByIdSignal = signal<TakeExamByIdResponse | null>(
    null
  );
  private readonly takeExamCreateSignal = signal<boolean | null>(null);
  private readonly takeExamUpdateSignal = signal<boolean | null>(null);
  private readonly takeExamChangeStateSignal = signal<boolean | null>(null);

  takeExamById(takeExamId: number): void {
    const requestUrl = `${env.api}${endpoint.TAKE_EXAM_BY_ID}${takeExamId}`;
    this.httpClient
      .get<BaseApiResponse<TakeExamByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.takeExamByIdSignal.set(data);
      });
  }

  takeExamCreate(takeExam: CreateTakeExamRequest): void {
    const requestUrl = `${env.api}${endpoint.TAKE_EXAM_CREATE}`;
    this.httpClient
      .post<BaseApiResponse<boolean>>(requestUrl, takeExam)
      .subscribe((resp) => {
        this.takeExamCreateSignal.set(resp.isSuccess);
      });
  }

  takeExamUpdate(takeExam: UpdateTakeExamRequest): void {
    const requestUrl = `${env.api}${endpoint.TAKE_EXAM_UPDATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, takeExam)
      .subscribe((resp) => {
        this.takeExamUpdateSignal.set(resp.isSuccess);
      });
  }

  takeExamChangeState(takeExamId: number, state: number): void {
    const requestUrl = `${env.api}${endpoint.TAKE_EXAM_CHANGE_STATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, { takeExamId, state })
      .subscribe({
        next: (resp) => {
          if (resp.isSuccess) {
            this.alertService.success('Excelente', resp.message);
            this.takeExamChangeStateSignal.set(true);
          } else {
            this.takeExamChangeStateSignal.set(false);
          }
        },
        error: () => this.takeExamChangeStateSignal.set(false),
      });
  }

  getTakeExamByIdSignal = this.takeExamByIdSignal.asReadonly();
  getTakeExamCreateSignal = this.takeExamCreateSignal.asReadonly();
  getTakeExamUpdateSignal = this.takeExamUpdateSignal.asReadonly();
  getTakeExamChangeStateSignal = this.takeExamChangeStateSignal.asReadonly();
}
