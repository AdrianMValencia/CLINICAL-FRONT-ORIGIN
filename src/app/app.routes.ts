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
  {
    path: 'doctors',
    loadComponent: () =>
      import('./pages/medics/components/medic-list/medic-list').then(
        (c) => c.MedicList
      ),
  },
  {
    path: 'patients',
    loadComponent: () =>
      import('./pages/patient/components/patient-list/patient-list').then(
        (c) => c.PatientList
      ),
  },
  {
    path: 'take-exams',
    loadComponent: () =>
      import('./pages/take-exam/components/take-exam-list/take-exam-list').then(
        (c) => c.TakeExamList
      ),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./pages/result/components/result-list/result-list').then(
        (c) => c.ResultList
      ),
  }
];

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: childrenRoutes,
  },
];
