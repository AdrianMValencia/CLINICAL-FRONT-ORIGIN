import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedApiResponse } from '@app/shared/models/commons/base-api-response.interface';

@Injectable({
  providedIn: 'root',
})
export abstract class DefaultTable {
  // Método abstracto que debe ser implementado por cualquier clase que extienda este servicio
  abstract getAll(
    pageSize: number, // Número de elementos por página (PageSize)
    sortBy: string, // Campo por el cual se quiere ordenar
    sortDirection: string, // Dirección de ordenamiento ('asc' o 'desc')
    pageNumber: number, // Número de la página actual (PageNumber - basado en 1)
    getInputs?: any // Parámetros adicionales que pueden venir como objeto
  ): Observable<PaginatedApiResponse<any>>; // El método retorna un Observable con la respuesta paginada
}
