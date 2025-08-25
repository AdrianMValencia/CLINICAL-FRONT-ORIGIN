import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@app/shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@app/shared/animations/scale-in.animation';
import { GenericButton } from '@app/shared/components/reusables/generic-button/generic-button';
import { SearchBox } from '@app/shared/components/reusables/search-box/search-box';
import { SplitButton } from '@app/shared/components/reusables/split-button/split-button';
import { TableColumns } from '@app/shared/models/reusables/list-table.interface';
import { SearchBoxModel } from '@app/shared/models/reusables/search-options.interface';
import { Actions } from '@app/shared/models/reusables/split-button.interface';
import { ListTable } from '@shared/components/reusables/list-table/list-table';
import { RowClick } from '@shared/models/reusables/rowclick-interface';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { AnalysisResponse } from '../../models/analysis-response.interface';
import { Analysis } from '../../services/analysis';
import { AnalysisManagement } from '../analysis-management/analysis-management';
import { componentAnalysisSetting } from './analysis-list.config';

@Component({
  selector: 'app-analysis-list',
  imports: [MatIcon, ListTable, GenericButton, SplitButton, SearchBox],
  templateUrl: './analysis-list.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class AnalysisList {
  public readonly analysisService = inject(Analysis);
  public readonly dialog = inject(MatDialog);
  public readonly componentAnalysis$ = componentAnalysisSetting;

  iconAnalysis$ = 'troubleshoot';
  resetChecks: boolean = false;

  newAnalysis(): void {
    this.dialog
      .open(AnalysisManagement, {
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsAnalysis(true);
        }
      });
  }

  rowClick(rowClick: RowClick<AnalysisResponse>) {
    let action = rowClick.action;
    let analysis = rowClick.row;

    switch (action) {
      case 'edit':
        this.analysisEdit(analysis);
        break;
      case 'delete':
        this.analysisDelete(analysis);
        break;
    }
  }

  async analysisEdit(analysisData: AnalysisResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = analysisData;
    const analysisDetail = await firstValueFrom(
      this.analysisService.analysisById(analysisData.analysisId)
    );

    let dialogRef = this.dialog.open(AnalysisManagement, {
      data: { mode: 'update', analysisDetail: analysisDetail },
      disableClose: true,
      width: '500px',
      enterAnimationDuration: 250,
      exitAnimationDuration: 250,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) this.setGetInputsAnalysis(true);
    });
  }

  analysisDelete(analysisData: AnalysisResponse) {
    Swal.fire({
      title: 'Eliminar análisis',
      text: `¿Realmente deseas eliminar el análisis ${analysisData.name}?`,
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
        this.analysisService
          .analysisDelete(analysisData.analysisId)
          .subscribe(() => {
            this.setGetInputsAnalysis(true);
          });
      }
    });
  }

  setGetInputsAnalysis(refresh: boolean) {
    if (!this.componentAnalysis$) return;

    this.componentAnalysis$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = '';
    if (!this.componentAnalysis$) return;

    if (this.componentAnalysis$.filters.textFilter != null) {
      str += `&numFilter=${this.componentAnalysis$.filters.numFilter}&textFilter=${this.componentAnalysis$.filters.textFilter}`;
    }

    if (this.componentAnalysis$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentAnalysis$.filters.refresh = false;
    }

    this.componentAnalysis$.getInputs = str;
  }

  search(data: SearchBoxModel) {
    if (!this.componentAnalysis$) return;
    this.componentAnalysis$.filters.numFilter = data.searchValue;
    this.componentAnalysis$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    if (!this.componentAnalysis$) return;

    switch (action) {
      case 1:
        this.componentAnalysis$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  initFilterReset() {
    if (!this.componentAnalysis$) return;

    this.componentAnalysis$.filters = {
      ...this.componentAnalysis$.initFilters,
    };
    this.formatGetInputs();
  }

  async onBadgeClick(event: {
    row: AnalysisResponse;
    column: TableColumns<unknown>;
  }) {
    const currentState = event.row.stateAnalysis.label === 'ACTIVO' ? 1 : 0;
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
      this.analysisService
        .analysisChangeState(event.row.analysisId, newState)
        .subscribe(() => {
          this.setGetInputsAnalysis(true);
        });
    }
  }
}
