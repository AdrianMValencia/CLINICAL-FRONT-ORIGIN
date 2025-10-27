import { Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@shared/animations/scale-in.animation';
import { GenericButton } from '@shared/components/reusables/generic-button/generic-button';
import { ListTable } from '@shared/components/reusables/list-table/list-table';
import { SearchBox } from '@shared/components/reusables/search-box/search-box';
import { SplitButton } from '@shared/components/reusables/split-button/split-button';
import { RowClick } from '@shared/models/reusables/rowclick-interface';
import { SearchBoxModel } from '@shared/models/reusables/search-options.interface';
import { Actions } from '@shared/models/reusables/split-button.interface';
import { ResultResponse } from '../../models/result-response.interface';
import { Result } from '../../services/result';
import { ResultManagement } from '../result-management/result-management';
import { componentResultSetting } from './result-list.config';

@Component({
  selector: 'app-result-list',
  imports: [MatIcon, ListTable, GenericButton, SplitButton, SearchBox],
  templateUrl: './result-list.html',
  animations: [scaleIn400ms, fadeInRight400ms],

})
export class ResultList {
  public readonly resultService = inject(Result);
  public readonly dialog = inject(MatDialog);
  public readonly componentResults$ = componentResultSetting;

  iconResult$ = 'monitor_heart';
  resetChecks: boolean = false;

  newResult(): void {
    this.dialog
      .open(ResultManagement, {
        disableClose: true,
        width: '950px',
        maxWidth: '95vw',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsResults(true);
        }
      });
  }

  rowClick(rowClick: RowClick<ResultResponse>) {
    let action = rowClick.action;
    let Result = rowClick.row;

    switch (action) {
      case 'edit':
        this.resultEdit(Result);
        break;
    }
  }

  private resultsDetailEffect = effect(() => {
    const resultsDetail = this.resultService.getResultByIdSignal();
    if (resultsDetail) {
      let dialogRef = this.dialog.open(ResultManagement, {
        data: { mode: 'update', resultsDetail },
        disableClose: true,
        width: '950px',
        maxWidth: '95vw',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) this.setGetInputsResults(true);

        this.resultService['resultByIdSignal'].set(null);
      });
    }
  });

  async resultEdit(resultsData: ResultResponse) {
    this.resultService.resultById(resultsData.resultId);
  }

  setGetInputsResults(refresh: boolean) {
    if (!this.componentResults$) return;

    this.componentResults$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = '';
    if (!this.componentResults$) return;

    if (this.componentResults$.filters.textFilter != null) {
      str += `&numFilter=${this.componentResults$.filters.numFilter}&textFilter=${this.componentResults$.filters.textFilter}`;
    }

    if (this.componentResults$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentResults$.filters.refresh = false;
    }

    this.componentResults$.getInputs = str;
  }

  search(data: SearchBoxModel) {
    if (!this.componentResults$) return;
    this.componentResults$.filters.numFilter = data.searchValue;
    this.componentResults$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    if (!this.componentResults$) return;

    switch (action) {
      case 1:
        this.componentResults$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  initFilterReset() {
    if (!this.componentResults$) return;

    this.componentResults$.filters = {
      ...this.componentResults$.initFilters,
    };
    this.formatGetInputs();
  }
}
