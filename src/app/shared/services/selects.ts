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
}
