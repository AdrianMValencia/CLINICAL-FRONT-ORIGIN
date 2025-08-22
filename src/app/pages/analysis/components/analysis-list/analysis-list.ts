import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { GenericButton } from '@app/shared/components/reusables/generic-button/generic-button';
import { ListTable } from '@shared/components/reusables/list-table/list-table';
import { RowClick } from '@shared/models/reusables/rowclick-interface';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';
import { AnalysisResponse } from '../../models/analysis-response.interface';
import { Analysis } from '../../services/analysis';
import { AnalysisManagement } from '../analysis-management/analysis-management';
import { componentAnalysisSetting } from './analysis-list.config';
type ComponentAnalysisSetting = typeof componentAnalysisSetting;

@Component({
  selector: 'app-analysis-list',
  imports: [MatIcon, ListTable, GenericButton],
  templateUrl: './analysis-list.html',
  styleUrl: './analysis-list.scss',
})
export class AnalysisList {
  public readonly analysisService = inject(Analysis);
  public readonly dialog = inject(MatDialog);

  iconAnalysis$ = 'troubleshoot';
  componentAnalysis$: ComponentAnalysisSetting | null = null;

  ngOnInit(): void {
    this.componentAnalysis$ = componentAnalysisSetting;
  }

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
  }
}
