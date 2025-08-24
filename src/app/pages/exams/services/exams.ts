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

  /**
   * @description Obtiene un examen por su ID y actualiza el signal examsByIdSignal.
   * @param examsId ID del examen a obtener.
   * @returns void
   */
  examsById(examsId: number): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_BY_ID}${examsId}`;
    this.httpClient
      .get<BaseApiResponse<ExamsByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.examsByIdSignal.set(data);
      });
  }

  /**
   * @description Crea un nuevo examen y actualiza el signal examsCreateSignal.
   * @param exams Datos del examen a crear.
   * @returns void
   */
  examsCreate(exams: CreateExamsRequest): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_CREATE}`;
    this.httpClient
      .post<BaseApiResponse<boolean>>(requestUrl, exams)
      .subscribe((resp) => {
        this.examsCreateSignal.set(resp.isSuccess);
      });
  }

  /**
   * @description Actualiza un examen existente y actualiza el signal examsUpdateSignal.
   * @param exams Datos del examen a actualizar.
   * @returns void
   */
  examsUpdate(exams: UpdateExamsRequest): void {
    const requestUrl = `${env.api}${endpoint.EXAMS_UPDATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, exams)
      .subscribe((resp) => {
        this.examsUpdateSignal.set(resp.isSuccess);
      });
  }

  /**
   * @description Elimina un examen por su ID y actualiza el signal.
   * @param examsId ID del examen a eliminar.
   */
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

  /**
   * @description Cambia el estado de un examen y actualiza el signal.
   * @param examId ID del examen a cambiar el estado.
   * @param state Nuevo estado del examen.
   */
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
  /**
   * @returns examsByIdSignal
   */
  getExamsByIdSignal = this.examsByIdSignal.asReadonly();
  /**
   * @returns examsCreateSignal
   */
  getExamsCreateSignal = this.examsCreateSignal.asReadonly();
  /**
   * @returns examsUpdateSignal
   */
  getExamsUpdateSignal = this.examsUpdateSignal.asReadonly();
  /**
   * @returns examsDeleteSignal
   */
  getExamsDeleteSignal = this.examsDeleteSignal.asReadonly();
  /**
   * @returns examsChangeStateSignal
   */
  getExamsChangeStateSignal = this.examsChangeStateSignal.asReadonly();
}
