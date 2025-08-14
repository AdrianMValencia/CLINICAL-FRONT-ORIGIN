import { TableColumns } from '@app/shared/models/reusables/list-table.interface';
import { AnalysisResponse } from '../../models/analysis-response.interface';

const tableColumns: TableColumns<AnalysisResponse>[] = [
  {
    label: 'Análisis',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'name',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'name',
    visible: true,
    download: true,
  },
  {
    label: 'Fecha de creación',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'auditCreateDate',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'datetime',
    sticky: false,
    sort: true,
    visible: true,
    download: true,
  },
  {
    label: 'Estado',
    cssLabel: [
      'font-bold',
      'text-xs',
      'text-am-main-blue-dark',
      'mat-sort-header-text-center',
    ],
    property: 'stateAnalysis',
    cssProperty: [],
    type: 'simpleBadge',
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: '',
    cssLabel: ['w-8'],
    property: 'icEdit',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    sortProperty: '',
    visible: true,
    action: 'edit',
  },
  {
    label: '',
    cssLabel: ['w-8'],
    property: 'icDelete',
    cssProperty: [],
    type: 'icon',
    sticky: true,
    sort: false,
    sortProperty: '',
    visible: true,
    action: 'delete',
  },
];


export const componentAnalysisSetting = {
  tableColumns,
  initialSort: 'Id',
  initialSortDir: 'desc',
  getInputs: '',
  filename: 'lista-de-análisis',
};