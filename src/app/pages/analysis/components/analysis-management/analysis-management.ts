import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputText } from '@shared/components/reusables/input-text/input-text';
import { Alert } from '@shared/services/alert';
import {
  CreateAnalysisRequest,
  UpdateAnalysisRequest,
} from '../../models/analysis-request.interface';
import { AnalysisByIdResponse } from '../../models/analysis-response.interface';
import { Analysis } from '../../services/analysis';

@Component({
  selector: 'app-analysis-management',
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
    InputText,
  ],
  templateUrl: './analysis-management.html',
})
export class AnalysisManagement {
  private readonly fb$ = inject(FormBuilder);
  private readonly analysisService = inject(Analysis);
  readonly dialogRef = inject(MatDialogRef<AnalysisManagement>);
  private readonly alert = inject(Alert);

  mode: 'create' | 'update';
  submitted = false;
  visible = false;
  loading = false;
  analysisForm!: FormGroup;
  analysisDialog;
  isLoadingForm = true;

  initForm(): void {
    this.analysisForm = this.fb$.group({
      analysisId: [0, [Validators.required]],
      name: [''],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      analysisDetail?: AnalysisByIdResponse;
    }
  ) {
    this.mode = data.mode;
    this.analysisDialog = data.analysisDetail;
    this.initForm();
    this.initMode();
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
    this.initCurrentValuesForm();
    this.visible = false;
  }

  initCurrentValuesForm() {
    const dialog = this.analysisDialog;
    this.analysisForm.patchValue({ ...dialog });
  }

  analysisSave() {
    this.submitted = true;
    if (this.analysisForm.valid) {
      this.loading = true;
      let data = this.analysisForm.getRawValue();
      this.analysisSaveByMode(data);
    }
  }

  analysisSaveByMode(data: CreateAnalysisRequest | UpdateAnalysisRequest) {
    switch (this.mode) {
      case 'create':
        this.analysisCreate(data as CreateAnalysisRequest);
        break;
      case 'update':
        this.analysisUpdate(data as UpdateAnalysisRequest);
        break;
    }
  }

  analysisCreate(data: CreateAnalysisRequest) {
    this.analysisService.analysisCreate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.swalResponse(response);
      } else {
        this.swalError(response.message);
      }
    });
  }

  analysisUpdate(data: UpdateAnalysisRequest) {
    this.analysisService.analysisUpdate(data).subscribe((response) => {
      if (response.isSuccess) {
        this.swalResponse(response);
      } else {
        this.swalError(response.message);
      }
    });
  }

  swalResponse(response: any) {
    this.loading = false;
    if (response.isSuccess) {
      this.dialogRef.close(true);
      this.alert.success('Excelente', response.message);
    } else {
      if (response.errors) {
        let errorMessages = '';
        response.errors.forEach((element: any) => {
          errorMessages = errorMessages + element.errorMessage + '<br>';
        });
        this.alert.warn('Advertencia', errorMessages);
      } else {
        this.alert.warn('Advertencia', response.message);
      }
    }
  }

  swalError(errorResponse: string) {
    this.loading = false;
    this.alert.error('Error', errorResponse);
  }
}
