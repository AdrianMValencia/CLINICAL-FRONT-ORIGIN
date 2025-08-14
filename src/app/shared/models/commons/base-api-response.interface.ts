export interface BaseApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  totalRecords: number;
  errors: any;
  accessToken: string;
  refreshToken: string;
}

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
