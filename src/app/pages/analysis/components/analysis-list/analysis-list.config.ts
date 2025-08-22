import { GenericButtonModel } from '@shared/models/reusables/generic-button.interface';
import { TableColumns } from '@shared/models/reusables/list-table.interface';
import {
  SplitButtonModel,
  Actions,
} from '@shared/models/reusables/split-button.interface';
import { AnalysisResponse } from '../../models/analysis-response.interface';
import { GenericValidators } from '@app/shared/utils/generic-validators.util';

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

const actionButtonAnalysis: GenericButtonModel = {
  label: 'Crear análisis',
  icon: 'add',
  tooltip: 'Crear nuevo análisis',
};

const filterButtons: SplitButtonModel[] = [
  {
    type: 'button',
    icon: 'refresh',
    label: 'Actualizar listado',
    value: Actions.ACTUALIZAR_LISTADO,
  },
  {
    type: 'action',
    id: 'Pendiente',
    icon: 'restart_alt',
    label: 'Refrescar filtros',
    value: Actions.REFRESCAR_FILTROS,
    classes: {
      icon: 'text-am-main-blue-dark text-md',
    },
  },
];

const searchOptions = [
  {
    label: 'Nombre',
    value: 1,
    placeholder: 'Buscar por nombre',
    validation: [GenericValidators.defaultName],
    validation_desc: 'Solo se permite letras en esta búsqueda.',
    icon: 'tune',
  },
];

const initFilters = {
  numFilter: 0,
  textFilter: '',
  refresh: false,
};

const filters = {
  numFilter: 0,
  textFilter: '',
  refresh: false,
};

export const componentAnalysisSetting = {
  tableColumns,
  actionButtonAnalysis,
  filterButtons,
  searchOptions,
  initFilters,
  filters,
  initialSort: 'Id',
  initialSortDir: 'desc',
  getInputs: '',
  filename: 'lista-de-análisis',
};
