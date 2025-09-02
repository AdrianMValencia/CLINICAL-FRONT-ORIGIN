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
import { TakeExamResponse } from '../../models/take-exam-response.interface';
import { TakeExam } from '../../services/take-exam';
import { TakeExamManagement } from '../take-exam-management/take-exam-management';
import { componentTakeExamSetting } from './take-exam-list.config';

@Component({
  selector: 'app-take-exam-list',
  imports: [MatIcon, ListTable, GenericButton, SplitButton, SearchBox],
  templateUrl: './take-exam-list.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class TakeExamList {
  public readonly takeExamService = inject(TakeExam);
  public readonly dialog = inject(MatDialog);
  public readonly componentTakeExams$ = componentTakeExamSetting;

  iconTakeExam$ = 'checklist';
  resetChecks: boolean = false;

  newTakeExam(): void {
    this.dialog
      .open(TakeExamManagement, {
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsTakeExams(true);
        }
      });
  }

  rowClick(rowClick: RowClick<TakeExamResponse>) {
    let action = rowClick.action;
    let takeExam = rowClick.row;

    switch (action) {
      case 'edit':
        this.takeExamEdit(takeExam);
        break;
    }
  }

  private takeExamsDetailEffect = effect(() => {
    const takeExamsDetail = this.takeExamService.getTakeExamByIdSignal();
    if (takeExamsDetail) {
      let dialogRef = this.dialog.open(TakeExamManagement, {
        data: { mode: 'update', takeExamsDetail },
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) this.setGetInputsTakeExams(true);

        this.takeExamService['takeExamByIdSignal'].set(null);
      });
    }
  });

  async takeExamEdit(takeExamsData: TakeExamResponse) {
    this.takeExamService.takeExamById(takeExamsData.takeExamId);
  }

  setGetInputsTakeExams(refresh: boolean) {
    if (!this.componentTakeExams$) return;

    this.componentTakeExams$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = '';
    if (!this.componentTakeExams$) return;

    if (this.componentTakeExams$.filters.textFilter != null) {
      str += `&numFilter=${this.componentTakeExams$.filters.numFilter}&textFilter=${this.componentTakeExams$.filters.textFilter}`;
    }

    if (this.componentTakeExams$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentTakeExams$.filters.refresh = false;
    }

    this.componentTakeExams$.getInputs = str;
  }

  search(data: SearchBoxModel) {
    if (!this.componentTakeExams$) return;
    this.componentTakeExams$.filters.numFilter = data.searchValue;
    this.componentTakeExams$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    if (!this.componentTakeExams$) return;

    switch (action) {
      case 1:
        this.componentTakeExams$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  initFilterReset() {
    if (!this.componentTakeExams$) return;

    this.componentTakeExams$.filters = {
      ...this.componentTakeExams$.initFilters,
    };
    this.formatGetInputs();
  }

  private takeExamsChangeStateEffect = effect(() => {
    const changed = this.takeExamService.getTakeExamChangeStateSignal();
    if (changed === true) {
      this.setGetInputsTakeExams(true);
      this.takeExamService['takeExamChangeStateSignal'].set(null);
    }
  });

  async onBadgeClick(event: {
    row: TakeExamResponse;
    column: TableColumns<unknown>;
  }) {
    const currentState = event.row.stateTakeExam.label === 'FINALIZADO' ? 1 : 0;
    const newState = currentState === 1 ? 0 : 1;

    const confirm = await Swal.fire({
      title: '¿Cambiar estado?',
      text: `¿Seguro que deseas cambiar el estado a ${
        newState === 1 ? 'FINALIZADO' : 'PENDIENTE'
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
      this.takeExamService.takeExamChangeState(event.row.takeExamId, newState);
    }
  }
}
