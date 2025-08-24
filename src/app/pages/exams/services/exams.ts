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
  CreateExamsRequest,
  UpdateExamsRequest,
} from '../models/exams-request.interface';
import {
  ExamsByIdResponse,
  ExamsResponse,
} from '../models/exams-response.interface';

@Injectable({
  providedIn: 'root',
})
export class Exams {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(Alert);

  getAll(
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    getInputs?: any
  ): Observable<PaginatedApiResponse<ExamsResponse>> {
    const requestUrl = `${env.api}${endpoint.LIST_EXAMS}?PageNumber=${pageNumber}&PageSize=${pageSize}${getInputs}`;

    return this.httpClient
      .get<PaginatedApiResponse<ExamsResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (exams: ExamsResponse) {
            exams.stateExam = getStateBadge(exams.stateExam);
            exams.icEdit = getIcon('edit', 'Actualizar examen', true);
            exams.icDelete = getIcon('delete', 'Eliminar examen', true);
          });
          return resp;
        })
      );
  }
  private readonly examsByIdSignal = signal<ExamsByIdResponse | null>(null);
  private readonly examsCreateSignal = signal<boolean | null>(null);
  private readonly examsUpdateSignal = signal<boolean | null>(null);
  private readonly examsDeleteSignal = signal<boolean | null>(null);
  private readonly examsChangeStateSignal = signal<boolean | null>(null);

  examsById(examsId: number): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_BY_ID}${examsId}`;
    this.httpClient
      .get<BaseApiResponse<ExamsByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.examsByIdSignal.set(data);
      });
  }

  examsCreate(exams: CreateExamsRequest): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_CREATE}`;
    this.httpClient
      .post<BaseApiResponse<boolean>>(requestUrl, exams)
      .subscribe((resp) => {
        this.examsCreateSignal.set(resp.isSuccess);
      });
  }

  examsUpdate(exams: UpdateExamsRequest): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_UPDATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, exams)
      .subscribe((resp) => {
        this.examsUpdateSignal.set(resp.isSuccess);
      });
  }

  examsDelete(examsId: number): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_DELETE}/${examsId}`;
    this.httpClient.delete<BaseApiResponse<boolean>>(requestUrl).subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
          this.examsDeleteSignal.set(true);
        } else {
          this.examsDeleteSignal.set(false);
        }
      },
      error: () => this.examsDeleteSignal.set(false),
    });
  }

  examsChangeState(examId: number, state: number): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_CHANGE_STATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, { examId, state })
      .subscribe({
        next: (resp) => {
          if (resp.isSuccess) {
            this.alertService.success('Excelente', resp.message);
            this.examsChangeStateSignal.set(true);
          } else {
            this.examsChangeStateSignal.set(false);
          }
        },
        error: () => this.examsChangeStateSignal.set(false),
      });
  }

  getExamsByIdSignal = this.examsByIdSignal.asReadonly();

  getExamsCreateSignal = this.examsCreateSignal.asReadonly();

  getExamsUpdateSignal = this.examsUpdateSignal.asReadonly();

  getExamsDeleteSignal = this.examsDeleteSignal.asReadonly();

  getExamsChangeStateSignal = this.examsChangeStateSignal.asReadonly();
}
