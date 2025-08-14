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
];

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: childrenRoutes,
  },
];
