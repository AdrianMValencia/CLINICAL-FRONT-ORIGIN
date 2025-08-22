export interface SearchOptions {
  label: string;
  value: number;
  placeholder: string;
  validation: any;
  validation_desc: string;
  icon: string;
  min_length?: number;
}

export interface SearchBoxModel {
  searchValue: number;
  searchData: string;
}
