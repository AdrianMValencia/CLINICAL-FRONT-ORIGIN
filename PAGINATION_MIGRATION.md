# Migración de Paginación - List Table Component

## Resumen de Cambios

Se ha adaptado el componente `list-table` y el servicio `DefaultTable` para funcionar con la nueva estructura de respuesta paginada del backend.

## Cambios Realizados

### 1. Nueva Interfaz de Respuesta Paginada

Se agregó la interfaz `PaginatedApiResponse<T>` en `src/app/shared/models/commons/base-api-response.interface.ts`:

```typescript
export interface PaginatedApiResponse<T> {
  pageNumber: number;
  totalPages: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  isSuccess: boolean;
  data: T[];
  message: string;
  errors: any;
}
```

### 2. Actualización del Servicio DefaultTable

Se actualizó el servicio abstracto `DefaultTable` en `src/app/shared/services/default-table.ts`:

- Cambio de parámetros para coincidir con la API del backend
- Uso de `pageNumber` basado en 1 (en lugar de 0)
- Retorno tipado con `PaginatedApiResponse<T>`

### 3. Adaptación del Componente ListTable

Se modificó el componente `list-table` en `src/app/shared/components/reusables/list-table/list-table.ts`:

- Importación de la nueva interfaz `PaginatedApiResponse`
- Ajuste del `pageIndex` para enviar `pageNumber` basado en 1 al backend
- Actualización del método `setData` para usar `totalCount` en lugar de `totalRecords`
- Tipado correcto de la respuesta del servicio

### 4. Actualización del Servicio de Análisis

Se actualizó el servicio `Analysis` en `src/app/pages/analysis/services/analysis.ts`:

- Extensión de `DefaultTable`
- Implementación del método `getAll` con la nueva firma
- URL actualizada para usar `PageNumber` y `PageSize`
- Uso de la nueva interfaz `PaginatedApiResponse`

## Estructura de Respuesta del Backend

El backend ahora devuelve:

```json
{
  "pageNumber": 1,
  "totalPages": 5,
  "totalCount": 42,
  "hasPreviousPage": false,
  "hasNextPage": true,
  "isSuccess": true,
  "data": [...],
  "message": "Consulta exitosa.",
  "errors": null
}
```

## Uso del Componente

El componente `list-table` se usa de la misma manera que antes:

```html
<app-list-table
  [service]="analysisService"
  [columns]="componentAnalysis$.tableColumns"
  [sortBy]="componentAnalysis$.initialSort"
  [sortDir]="componentAnalysis$.initialSortDir"
  [getInputs]="componentAnalysis$.getInputs"
/>
```

## Beneficios

1. **Tipado fuerte**: Mejor control de tipos con TypeScript
2. **Consistencia**: Estructura uniforme para todas las respuestas paginadas
3. **Flexibilidad**: Fácil extensión para otros servicios
4. **Mantenibilidad**: Código más limpio y organizado

## Notas Importantes

- El `pageNumber` se envía basado en 1 (no en 0 como antes)
- El `totalCount` reemplaza a `totalRecords` para el total de registros
- La paginación funciona automáticamente con el componente Material
- Los servicios que extiendan `DefaultTable` deben implementar la nueva firma del método `getAll`
