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
  CreatePatientRequest,
  UpdatePatientRequest,
} from '../models/patient-request.interface';
import {
  PatientByIdResponse,
  PatientResponse,
} from '../models/patient-response.interface';

@Injectable({
  providedIn: 'root',
})
export class Patient {
  private readonly httpClient = inject(HttpClient);
  private readonly alertService = inject(Alert);

  getAll(
    pageSize: number,
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    getInputs?: any
  ): Observable<PaginatedApiResponse<PatientResponse>> {
    const requestUrl = `${env.api}${endpoint.LIST_PATIENTS}?PageNumber=${pageNumber}&PageSize=${pageSize}${getInputs}`;

    return this.httpClient
      .get<PaginatedApiResponse<PatientResponse>>(requestUrl)
      .pipe(
        map((resp) => {
          resp.data.forEach(function (patient: PatientResponse) {
            patient.statePatient = getStateBadge(patient.statePatient);
            patient.icEdit = getIcon('edit', 'Actualizar paciente', true);
            patient.icDelete = getIcon('delete', 'Eliminar paciente', true);
          });
          return resp;
        })
      );
  }
  private readonly patientByIdSignal = signal<PatientByIdResponse | null>(null);
  private readonly patientCreateSignal = signal<boolean | null>(null);
  private readonly patientUpdateSignal = signal<boolean | null>(null);
  private readonly patientDeleteSignal = signal<boolean | null>(null);
  private readonly patientChangeStateSignal = signal<boolean | null>(null);

  patientById(patientId: number): void {
    const requestUrl = `${env.api}${endpoint.PATIENT_BY_ID}${patientId}`;
    this.httpClient
      .get<BaseApiResponse<PatientByIdResponse>>(requestUrl)
      .pipe(map((resp) => resp.data))
      .subscribe((data) => {
        this.patientByIdSignal.set(data);
      });
  }

  patientCreate(patient: CreatePatientRequest): void {
    const requestUrl = `${env.api}${endpoint.PATIENT_CREATE}`;
    this.httpClient
      .post<BaseApiResponse<boolean>>(requestUrl, patient)
      .subscribe((resp) => {
        this.patientCreateSignal.set(resp.isSuccess);
      });
  }

  patientUpdate(patient: UpdatePatientRequest): void {
    const requestUrl = `${env.api}${endpoint.PATIENT_UPDATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, patient)
      .subscribe((resp) => {
        this.patientUpdateSignal.set(resp.isSuccess);
      });
  }

  patientDelete(patientId: number): void {
    const requestUrl = `${env.api}${endpoint.PATIENT_DELETE}/${patientId}`;
    this.httpClient.delete<BaseApiResponse<boolean>>(requestUrl).subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          this.alertService.success('Excelente', resp.message);
          this.patientDeleteSignal.set(true);
        } else {
          this.patientDeleteSignal.set(false);
        }
      },
      error: () => this.patientDeleteSignal.set(false),
    });
  }

  patientChangeState(patientId: number, state: number): void {
    const requestUrl = `${env.api}${endpoint.PATIENT_CHANGE_STATE}`;
    this.httpClient
      .put<BaseApiResponse<boolean>>(requestUrl, { patientId, state })
      .subscribe({
        next: (resp) => {
          if (resp.isSuccess) {
            this.alertService.success('Excelente', resp.message);
            this.patientChangeStateSignal.set(true);
          } else {
            this.patientChangeStateSignal.set(false);
          }
        },
        error: () => this.patientChangeStateSignal.set(false),
      });
  }

  getPatientByIdSignal = this.patientByIdSignal.asReadonly();
  getPatientCreateSignal = this.patientCreateSignal.asReadonly();
  getPatientUpdateSignal = this.patientUpdateSignal.asReadonly();
  getPatientDeleteSignal = this.patientDeleteSignal.asReadonly();
  getPatientChangeStateSignal = this.patientChangeStateSignal.asReadonly();
}
