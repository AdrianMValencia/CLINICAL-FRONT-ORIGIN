import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';

const childrenRoutes: Routes = [
  {
    path: 'analysis',
    loadComponent: () =>
      import('./pages/analysis/components/analysis-list/analysis-list').then(
        (c) => c.AnalysisList
      ),
  },
  {
    path: 'exams',
    loadComponent: () =>
      import('./pages/exams/components/exams-list/exams-list').then(
        (c) => c.ExamsList
      ),
  },
];

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: childrenRoutes,
  },
];
