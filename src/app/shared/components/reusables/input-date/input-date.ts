import { CommonModule, DatePipe } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from '@angular/material/core';
import {
  MatCalendarCellCssClasses,
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateFormatModule } from '@shared/utils/date-format/data-format.module';
import moment from 'moment';

@Component({
  selector: 'app-input-date',
  imports: [
    CommonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    DateFormatModule,
  ],
  templateUrl: './input-date.html',
  providers: [DatePipe, { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }],
})
export class InputDate {
  @Input() inputControl: any | FormControl = new FormControl(null);
  @Input() label: string = 'Input';
  @Input() required: boolean = false;
  @Input() placeholder: string = '';
  @Input() mode: any | 'create' | 'read' | 'update';
  @Input() min: any | string = '';
  @Input() max: any | string = '';
  @Input() isLoading: boolean = false;
  @Input() withLabel: boolean = true;
  @Input() hint: boolean = false;
  @Input() initDayFilter: any | Date;

  //Fechas
  @Input() serie: any = [];
  @Input() cssserie: any = '';
  @Input() titleserie: any = '';

  @ViewChild('datepickerFooter', { static: false })
  datepickerFooter: any | ElementRef;
  @ViewChild('datepicker', { static: false }) datepicker:
    | any
    | MatDatepicker<any>;

  dateClass = (cellDate: any, view: any): any | MatCalendarCellCssClasses => {
    let serie = this.serie.map((d: any) => moment(d));
    if (view === 'month') {
      try {
        let is_serie = serie.find((d: any) => {
          return d.isSame(cellDate);
        });
        if (is_serie != undefined) {
          return this.cssserie;
        }
        return '';
      } catch (e) {
        return '';
      }
    }
  };

  constructor(
    private datepipe: DatePipe,
    private dateAdapter: DateAdapter<Date>
  ) {}

  ngOnInit(): void {
    this.setValidators();
    this.dateAdapter.setLocale('es-ES');
  }

  setValidators() {
    if (this.required) {
      this.inputControl.setValidators([Validators.required]);
    }
  }

  formatDate(event: any) {
    let date = this.datepipe.transform(event.value, 'yyyy-MM-dd', 'es-ES');
    this.inputControl.setValue(date);
  }

  onOpen() {
    let titles: string[] = [this.titleserie];
    if (!titles.every((x) => x === '')) {
      this.appendFooter();
    }
  }

  private appendFooter() {
    const matCalendar = document.getElementsByClassName(
      'mat-datepicker-content'
    )[0] as HTMLElement;
    matCalendar.appendChild(this.datepickerFooter.nativeElement);
  }
}
