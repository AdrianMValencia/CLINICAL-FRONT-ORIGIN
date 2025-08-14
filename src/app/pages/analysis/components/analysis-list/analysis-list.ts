import { Component, inject } from '@angular/core';
import { ListTable } from '../../../../shared/components/reusables/list-table/list-table';
import { Analysis } from '../../services/analysis';
import { componentAnalysisSetting } from './analysis-list.config';

@Component({
  selector: 'app-analysis-list',
  imports: [ListTable],
  templateUrl: './analysis-list.html',
  styleUrl: './analysis-list.scss',
})
export class AnalysisList {
  public readonly analysisService = inject(Analysis);
  componentAnalysis$: any;

  ngOnInit(): void {
    this.componentAnalysis$ = componentAnalysisSetting;
  }
}
