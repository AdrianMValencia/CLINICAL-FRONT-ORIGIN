import { Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@shared/animations/scale-in.animation';
import { GenericButton } from '@shared/components/reusables/generic-button/generic-button';
import { ListTable } from '@shared/components/reusables/list-table/list-table';
import { SearchBox } from '@shared/components/reusables/search-box/search-box';
import { SplitButton } from '@shared/components/reusables/split-button/split-button';
import { TableColumns } from '@shared/models/reusables/list-table.interface';
import { RowClick } from '@shared/models/reusables/rowclick-interface';
import { SearchBoxModel } from '@shared/models/reusables/search-options.interface';
import { Actions } from '@shared/models/reusables/split-button.interface';
import Swal from 'sweetalert2';
import { ExamsResponse } from '../../models/exams-response.interface';
import { Exams } from '../../services/exams';
import { ExamsManagement } from '../exams-management/exams-management';
import { componentExamsSetting } from './exams-list.config';

@Component({
  selector: 'app-exams-list',
  imports: [MatIcon, ListTable, GenericButton, SplitButton, SearchBox],
  templateUrl: './exams-list.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class ExamsList {
  public readonly examsService = inject(Exams);
  public readonly dialog = inject(MatDialog);
  public readonly componentExams$ = componentExamsSetting;

  iconExams$ = 'troubleshoot';
  resetChecks: boolean = false;

  newExams(): void {
    this.dialog
      .open(ExamsManagement, {
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsExams(true);
        }
      });
  }

  rowClick(rowClick: RowClick<ExamsResponse>) {
    let action = rowClick.action;
    let Exams = rowClick.row;

    switch (action) {
      case 'edit':
        this.examsEdit(Exams);
        break;
      case 'delete':
        this.examsDelete(Exams);
        break;
    }
  }

  private examsDetailEffect = effect(() => {
    const examsDetail = this.examsService.getExamsByIdSignal();
    if (examsDetail) {
      let dialogRef = this.dialog.open(ExamsManagement, {
        data: { mode: 'update', examsDetail },
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) this.setGetInputsExams(true);

        this.examsService['examsByIdSignal'].set(null);
      });
    }
  });

  async examsEdit(examsData: ExamsResponse) {
    this.examsService.examsById(examsData.examId);
  }

  examsDelete(examsData: ExamsResponse) {
    Swal.fire({
      title: 'Eliminar examen',
      text: `¿Realmente deseas eliminar el examen ${examsData.name}?`,
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.examsService.examsDelete(examsData.examId);
        this.setGetInputsExams(true);
      }
    });
  }

  setGetInputsExams(refresh: boolean) {
    if (!this.componentExams$) return;

    this.componentExams$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = '';
    if (!this.componentExams$) return;

    if (this.componentExams$.filters.textFilter != null) {
      str += `&numFilter=${this.componentExams$.filters.numFilter}&textFilter=${this.componentExams$.filters.textFilter}`;
    }

    if (this.componentExams$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentExams$.filters.refresh = false;
    }

    this.componentExams$.getInputs = str;
  }

  search(data: SearchBoxModel) {
    if (!this.componentExams$) return;
    this.componentExams$.filters.numFilter = data.searchValue;
    this.componentExams$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    if (!this.componentExams$) return;

    switch (action) {
      case 1:
        this.componentExams$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  initFilterReset() {
    if (!this.componentExams$) return;

    this.componentExams$.filters = {
      ...this.componentExams$.initFilters,
    };
    this.formatGetInputs();
  }

  private examsChangeStateEffect = effect(() => {
    const changed = this.examsService.getExamsChangeStateSignal();
    if (changed === true) {
      this.setGetInputsExams(true);
      this.examsService['examsChangeStateSignal'].set(null);
    }
  });

  async onBadgeClick(event: {
    row: ExamsResponse;
    column: TableColumns<unknown>;
  }) {
    const currentState = event.row.stateExam.label === 'ACTIVO' ? 1 : 0;
    const newState = currentState === 1 ? 0 : 1;

    const confirm = await Swal.fire({
      title: '¿Cambiar estado?',
      text: `¿Seguro que deseas cambiar el estado a ${
        newState === 1 ? 'ACTIVO' : 'INACTIVO'
      }?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      width: 430,
    });

    if (confirm.isConfirmed) {
      this.examsService.examsChangeState(event.row.examId, newState);
    }
  }
}
