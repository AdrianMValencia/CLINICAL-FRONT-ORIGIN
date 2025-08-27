import { GenericButtonModel } from '@shared/models/reusables/generic-button.interface';
import { TableColumns } from '@shared/models/reusables/list-table.interface';
import {
    Actions,
    SplitButtonModel,
} from '@shared/models/reusables/split-button.interface';
import { GenericValidators } from '@shared/utils/generic-validators.util';
import { MedicsResponse } from '../../models/medics-response.interface';

const tableColumns: TableColumns<MedicsResponse>[] = [
  {
    label: 'Nombres',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'names',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'names',
    visible: true,
    download: true,
  },
  {
    label: 'Apellidos',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'surnames',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'surnames',
    visible: true,
    download: true,
  },
  {
    label: 'Dirección',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'address',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'address',
    visible: true,
    download: true,
  },
  {
    label: 'Teléfono',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'phone',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'phone',
    visible: true,
    download: true,
  },
  {
    label: 'Fecha de nacimiento',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'birthDate',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'date',
    sticky: false,
    sort: true,
    visible: true,
    download: true,
  },
  {
    label: 'Tipo de documento',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'documentType',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'documentType',
    visible: true,
    download: true,
  },
  {
    label: 'Número de documento',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'documentNumber',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'documentNumber',
    visible: true,
    download: true,
  },
  {
    label: 'Especialidad',
    cssLabel: ['font-bold', 'text-xs', 'text-am-main-blue-dark'],
    property: 'specialty',
    cssProperty: ['text-xs', 'font-bold', 'whitespace-normal', 'max-w-120'],
    type: 'text',
    sticky: false,
    sort: true,
    sortProperty: 'specialty',
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
    property: 'stateMedic',
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

const actionButtonMedics: GenericButtonModel = {
  label: 'Crear médico',
  icon: 'add',
  tooltip: 'Crear nuevo médico',
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

export const componentMedicsSetting = {
  tableColumns,
  actionButtonMedics,
  filterButtons,
  searchOptions,
  initFilters,
  filters,
  initialSort: 'Id',
  initialSortDir: 'desc',
  getInputs: '',
  filename: 'lista-de-medicos',
};
