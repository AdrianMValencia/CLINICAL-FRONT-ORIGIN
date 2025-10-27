import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as env } from '@env/environment.development';
import { BaseApiResponse } from '@shared/models/commons/base-api-response.interface';
import { SelectResponse } from '@shared/models/commons/select-response.interface';
import { endpoint } from '@shared/utils/endpoints.util';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Selects {
  private http = inject(HttpClient);

  listAnalysis(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.ANALYSIS_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listSpecialty(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.SPECIALTY_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listDocumentTypes(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.DOCUMENT_TYPE_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listAgeTypes(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.AGE_TYPE_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listGenders(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.GENDER_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listMedics(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.MEDICS_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listPatients(): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.PATIENT_SELECT}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listExamsByAnalysisId(analysisId: number): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.EXAMS_SELECT_BY_ANALYSIS}${analysisId}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }

  listTakeExamsByPatient(patientId: number): Observable<SelectResponse[]> {
    const requestUrl = `${env.api}${endpoint.TAKE_EXAM_BY_PATIENT}${patientId}`;
    return this.http.get<BaseApiResponse<SelectResponse[]>>(requestUrl).pipe(
      map((resp) => {
        return resp.data;
      })
    );
  }
}
