import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { fadeInUp400ms } from '@app/shared/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@app/shared/animations/scale-fade-in.animation';
import { PaginatedApiResponse } from '@app/shared/models/commons/base-api-response.interface';
import {
  TableColumns,
  TableFooter,
} from '@app/shared/models/reusables/list-table.interface';
import { HourFormatPipe } from '@app/shared/pipes/hour-format-pipe';
import { DefaultTable } from '@app/shared/services/default-table';
import { getEsPaginatorIntl } from '@app/shared/utils/es-paginator-intl.util';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-list-table',
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatPaginatorModule,
    NgxSpinnerModule,
    MatIconModule,
    MatMenuModule,
    RouterModule,
    HourFormatPipe,
  ],
  templateUrl: './list-table.html',
  styleUrl: './list-table.scss',
  animations: [
    scaleFadeIn400ms,
    fadeInUp400ms,
    trigger('detailExpand', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', visibility: 'hidden' })
      ),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
  providers: [
    { provide: MatPaginatorIntl, useValue: getEsPaginatorIntl() },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
      } as MatFormFieldDefaultOptions,
    },
  ],
})
export class ListTable<T> implements OnInit, AfterViewInit, OnChanges {
  @Input() service!: DefaultTable; // Input para el servicio que maneja los datos
  @Input() columns!: any | TableColumns<T>[]; // Input para las columnas de la tabla
  @Input() getInputs: any; // Input para obtener datos adicionales
  @Input() sortBy!: string; // Input para el campo por el cual ordenar
  @Input() sortDir: any | string = 'asc'; // Input para la dirección de ordenamiento inicial (ascendente por defecto)
  @Input() footer: TableFooter<T>[] = []; // Input para el pie de página de la tabla
  @Output() rowClick = new EventEmitter<any>(); // Output para emitir eventos al hacer clic en una fila
  @Input() subColumns: any; // Input para columnas secundarias
  @Input() expandableTable = false; // Input para indicar si la tabla es expandible
  @Input() striped = true; // Input para alternar filas con estilos rayados
  @Input() showPaginator = true; // Input para mostrar o no el paginador

  @ViewChild(MatPaginator) paginator!: MatPaginator; // ViewChild para el paginador de la tabla
  @ViewChild(MatSort) sort!: MatSort; // ViewChild para el ordenador de la tabla
  changesGetInputs = new EventEmitter<any>(); // EventEmitter para cambios en los inputs

  expandedElement: any; // Variable para el elemento expandido (si aplica)
  dataSource = new MatTableDataSource<T>(); // Fuente de datos para la tabla
  visibleColumns!: Array<keyof T | string>; // Columnas visibles en la tabla
  visibleFooter: any; // Pie de página visible en la tabla
  paginatorOptions = {
    // Opciones del paginador
    pageSizeOptions: [10, 20, 50], // Opciones de tamaño de página
    pageSize: 10, // Tamaño de página inicial
    pageLength: 0, // Longitud total de registros
  };
  @Output() badgeClick = new EventEmitter<{
    row: T;
    column: TableColumns<T>;
  }>();

  constructor(
    private spinner: NgxSpinnerService // Servicio para manejar el spinner de carga
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator; // Configura el paginador en la fuente de datos
    this.dataSource.sort = this.sort; // Configura el ordenador en la fuente de datos
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.setVisibleColums(); // Actualiza las columnas visibles cuando cambian las columnas
    }

    if (changes.getInputs && this.paginator) {
      this.paginator.pageIndex = 0; // Reinicia el índice del paginador al cambiar los inputs y si existe el paginador
      this.changesGetInputs.emit(); // Emite el evento de cambios en los inputs
    }
  }

  ngAfterViewInit(): void {
    this.getDataByService(); // Obtiene los datos del servicio después de inicializar la vista
    this.sortChanges(); // Maneja los cambios de ordenamiento
    this.paginatorChanges(); // Maneja los cambios del paginador
  }

  rowButtonMenuAction(e: any) {
    this.changesGetInputs.emit(); // Emite el evento de cambios en los inputs al realizar una acción en un botón de fila
  }

  closeMe(menuTrigger: MatMenuTrigger) {
    menuTrigger.closeMenu(); // Cierra el menú contextual
  }

  async getDataByService() {
    this.changesGetInputs
      .pipe(
        startWith(''),
        switchMap(() => {
          this.spinner.show('modal-table'); // Muestra el spinner de carga
          return this.service.getAll(
            // Obtiene todos los datos del servicio
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex + 1, // Ajustamos para que el backend reciba PageNumber basado en 1
            this.getInputs
          );
        })
      )
      .subscribe((data: PaginatedApiResponse<T>) => {
        this.setData(data); // Configura los datos obtenidos en la tabla
        this.spinner.hide('modal-table'); // Oculta el spinner de carga
      });
  }

  setData(data: PaginatedApiResponse<T>) {
    if (data.isSuccess) {
      this.setVisibleColums(); // Actualiza las columnas visibles
      this.paginatorOptions.pageLength = data.totalCount; // Configura el total de registros desde la respuesta paginada
      this.dataSource.data = data.data; // Configura los datos en la fuente de datos de la tabla
      // if (data.data.footer) this.setFooter(data.data.footer); // Configura el pie de página si está disponible en los datos
    }
  }

  setFooter(data: any) {
    this.visibleFooter = [];
    if (this.footer.length && data) {
      this.footer.forEach((e) => {
        this.visibleFooter.push({
          // Configura el pie de página visible
          label: e.label,
          value: data[e.property],
          tooltip: e.tooltip,
        });
      });
    }
  }

  setVisibleColums() {
    this.visibleColumns = this.columns // Configura las columnas visibles en base a las columnas recibidas
      .filter((column: any) => column.visible)
      .map((column: any) => column.property);
  }

  sortChanges() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0; // Reinicia el índice del paginador al cambiar el orden
      this.changesGetInputs.emit(); // Emite el evento de cambios en los inputs
    });
  }

  paginatorChanges() {
    this.paginator.page.subscribe(() => {
      this.changesGetInputs.emit(); // Emite el evento de cambios en los inputs al cambiar de página
    });
  }

  onBadgeClick(row: T, column: TableColumns<T>) {
    this.badgeClick.emit({ row, column });
  }
}
