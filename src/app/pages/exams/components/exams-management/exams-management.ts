import { Component, effect, Inject, inject } from '@angular/core';
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
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputSelect } from '@shared/components/reusables/input-select/input-select';
import { InputText } from '@shared/components/reusables/input-text/input-text';
import { Exams } from '../../services/exams';
import { Alert } from '@shared/services/alert';
import { ExamsByIdResponse } from '../../models/exams-response.interface';
import {
  CreateExamsRequest,
  UpdateExamsRequest,
} from '../../models/exams-request.interface';

@Component({
  selector: 'app-exams-management',
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
    InputSelect,
  ],
  templateUrl: './exams-management.html',
})
export class ExamsManagement {
  private readonly fb$ = inject(FormBuilder);
  private readonly examsService = inject(Exams);
  readonly dialogRef = inject(MatDialogRef<ExamsManagement>);
  private readonly alert = inject(Alert);

  mode: 'create' | 'update';
  submitted = false;
  visible = false;
  loading = false;
  examsForm!: FormGroup;
  examsDialog;
  isLoadingForm = true;

  initForm(): void {
    this.examsForm = this.fb$.group({
      examId: [0, [Validators.required]],
      name: [''],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      examsDetail?: ExamsByIdResponse;
    }
  ) {
    this.mode = data.mode;
    this.examsDialog = data.examsDetail;
    this.initForm();
    this.initMode();
  }

  ngOnInit(): void {
    effect(() => {
      const success = this.examsService.getExamsCreateSignal();
      if (success !== null) {
        this.loading = false;
        if (success) {
          this.swalResponse({
            isSuccess: true,
            message: 'Examen creado correctamente',
          });
        } else {
          this.swalError('Error al crear el examen');
        }
        (this.examsService as any).examsCreateSignal.set(null);
      }
    });

    effect(() => {
      const success = this.examsService.getExamsUpdateSignal();
      if (success !== null) {
        this.loading = false;
        if (success) {
          this.swalResponse({
            isSuccess: true,
            message: 'Examen actualizado correctamente',
          });
        } else {
          this.swalError('Error al actualizar el examen');
        }
        (this.examsService as any).examsUpdateSignal.set(null);
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
    this.initCurrentValuesForm();
    this.visible = false;
  }

  initCurrentValuesForm() {
    const dialog = this.examsDialog;
    this.examsForm.patchValue({ ...dialog });
  }

  examsSave() {
    this.submitted = true;
    if (this.examsForm.valid) {
      this.loading = true;
      let data = this.examsForm.getRawValue();
      this.examsSaveByMode(data);
    }
  }

  examsSaveByMode(data: CreateExamsRequest | UpdateExamsRequest) {
    switch (this.mode) {
      case 'create':
        // this.examsCreate(data as CreateExamsRequest);
        this.examsService.examsCreate(data as CreateExamsRequest);
        break;
      case 'update':
        // this.examsUpdate(data as UpdateExamsRequest);
        this.examsService.examsUpdate(data as UpdateExamsRequest);
        break;
    }
  }

  // examsCreate(data: CreateExamsRequest) {
  //   this.examsService.examsCreate(data).subscribe((response) => {
  //     if (response.isSuccess) {
  //       this.swalResponse(response);
  //     } else {
  //       this.swalError(response.message);
  //     }
  //   });
  // }

  // examsUpdate(data: UpdateExamsRequest) {
  //   this.examsService.examsUpdate(data).subscribe((response) => {
  //     if (response.isSuccess) {
  //       this.swalResponse(response);
  //     } else {
  //       this.swalError(response.message);
  //     }
  //   });
  // }

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
