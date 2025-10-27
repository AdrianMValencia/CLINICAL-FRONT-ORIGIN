import { Component, effect, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputSelect } from '@shared/components/reusables/input-select/input-select';
import { SelectResponse } from '@shared/models/commons/select-response.interface';
import { Alert } from '@shared/services/alert';
import { Selects } from '@shared/services/selects';
import { ResultByIdResponse, TakeExamDetailAnalysisByTakeExamResponse } from '../../models/result-response.interface';
import { Result } from '../../services/result';

@Component({
  selector: 'app-result-management',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatIconModule,
    InputSelect,
  ],
  templateUrl: './result-management.html',
})
export class ResultManagement {
  private readonly fb$ = inject(FormBuilder);
  private readonly resultService = inject(Result);
  readonly dialogRef = inject(MatDialogRef<ResultManagement>);
  private readonly alert = inject(Alert);
  private readonly selectsService = inject(Selects);

  patients$: SelectResponse[] = [];
  takeExamsByPatient$: SelectResponse[] = [];
  takeExamDetails$: TakeExamDetailAnalysisByTakeExamResponse[] = [];
  mode: 'create' | 'update';
  visible = false;
  loading = false;
  resultForm!: FormGroup;
  resultDialog?: ResultByIdResponse;
  loadingExams = false;

  initForm(): void {
    this.resultForm = this.fb$.group({
      patientId: [''],
      takeExamId: [''],
      resultFile: [''],
      takeExamDetailId: [''],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      resultDetail?: ResultByIdResponse;
    }
  ) {
    this.mode = data.mode;
    this.resultDialog = data.resultDetail;
    this.initForm();
    this.initMode();

    effect(() => {
      const takeExamDetails = this.resultService.takeExamDetailAnalysisByTakeExamSignal();
      if (takeExamDetails) {
        this.takeExamDetails$ = takeExamDetails;
        this.loadingExams = false;
      }
    });
  }

  ngOnInit(): void {
    this.getPatientsSelect();

    this.resultForm.get('takeExamId')?.valueChanges.subscribe((takeExamId: number) => {
      this.loadingExams = true;
      if (takeExamId) {
        this.resultService.takeExamsDetailAnalysisByTakeExam(takeExamId);
      } else {
        this.takeExamDetails$ = [];
        this.loadingExams = false;
      }
    });

    this.resultForm.get('patientId')?.valueChanges.subscribe((patientId) => {
      if (patientId) {
        this.getTakeExamsByPatient(patientId);
      } else {
        this.takeExamsByPatient$ = [];
        this.resultForm.get('takeExamId')?.setValue('');
      }
    })
  }

  getPatientsSelect() {
    this.selectsService.listPatients().subscribe({
      next: (response) => {
        this.patients$ = response;
      }
    })
  }

  getTakeExamsByPatient(patientId: number) {
    this.selectsService.listTakeExamsByPatient(patientId).subscribe({
      next: (response) => {
        this.takeExamsByPatient$ = response;
      }
    });
  }

  initMode() {
    switch (this.mode) {
      case 'create':
        break;
      case 'update':
        this.initUpdateMode();
        break;
    }
  }

  initUpdateMode() {

  }
}
