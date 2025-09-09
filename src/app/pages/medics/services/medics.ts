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
  CreateMedicsRequest,
  UpdateMedicsRequest,
} from '../models/medics-request.interface';
import {
  MedicsByIdResponse,
  MedicsResponse,
} from '../models/medics-response.interface';

@Injectable({
  providedIn: 'root',
})
export class Medics {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(Alert);

  getAll(
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    getInputs?: any
  ): Observable<PaginatedApiResponse<MedicsResponse>> {
    const requestUrl = `${env.api}${endpoint.LIST_MEDICS}?PageNumber=${pageNumber}&PageSize=${pageSize}${getInputs}`;

    return this.httpClient
      .get<PaginatedApiResponse<MedicsResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (medics: MedicsResponse) {
            medics.stateMedic = getStateBadge(medics.stateMedic);
            medics.icEdit = getIcon('edit', 'Actualizar médico', true);
            medics.icDelete = getIcon('delete', 'Eliminar médico', true);
          });
          return resp;
        })
      );
  }
  private readonly medicsByIdSignal = signal<MedicsByIdResponse | null>(null);
  private readonly medicsCreateSignal = signal<boolean | null>(null);
  private readonly medicsUpdateSignal = signal<boolean | null>(null);
  private readonly medicsDeleteSignal = signal<boolean | null>(null);
  private readonly medicsChangeStateSignal = signal<boolean | null>(null);

  medicsById(medicsId: number): void {
    const requestUrl = `${env.api}${endpoint.MEDICS_BY_ID}${medicsId}`;
    this.httpClient
      .get<BaseApiResponse<MedicsByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.medicsByIdSignal.set(data);
      });
  }

  medicsCreate(medics: CreateMedicsRequest): void {
    const requestUrl = `${env.api}${endpoint.MEDICS_CREATE}`;
    this.httpClient
      .post<BaseApiResponse<boolean>>(requestUrl, medics)
      .subscribe((resp) => {
        this.medicsCreateSignal.set(resp.isSuccess);
      });
  }

  medicsUpdate(medics: UpdateMedicsRequest): void {
    const requestUrl = `${env.api}${endpoint.MEDICS_UPDATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, medics)
      .subscribe((resp) => {
        this.medicsUpdateSignal.set(resp.isSuccess);
      });
  }

  medicsDelete(medicsId: number): void {
    const requestUrl = `${env.api}${endpoint.MEDICS_DELETE}/${medicsId}`;
    this.httpClient.delete<BaseApiResponse<boolean>>(requestUrl).subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
          this.medicsDeleteSignal.set(true);
        } else {
          this.medicsDeleteSignal.set(false);
        }
      },
      error: () => this.medicsDeleteSignal.set(false),
    });
  }

  medicsChangeState(medicId: number, state: number): void {
    const requestUrl = `${env.api}${endpoint.MEDICS_CHANGE_STATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, { medicId, state })
      .subscribe({
        next: (resp) => {
          if (resp.isSuccess) {
            this.alertService.success('Excelente', resp.message);
            this.medicsChangeStateSignal.set(true);
          } else {
            this.medicsChangeStateSignal.set(false);
          }
        },
        error: () => this.medicsChangeStateSignal.set(false),
      });
  }

  getMedicsByIdSignal = this.medicsByIdSignal.asReadonly();
  getMedicsCreateSignal = this.medicsCreateSignal.asReadonly();
  getMedicsUpdateSignal = this.medicsUpdateSignal.asReadonly();
  getMedicsDeleteSignal = this.medicsDeleteSignal.asReadonly();
  getMedicsChangeStateSignal = this.medicsChangeStateSignal.asReadonly();
}
