import { Component, effect, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { InputSelect } from '@shared/components/reusables/input-select/input-select';
import { InputText } from '@shared/components/reusables/input-text/input-text';
import { SelectResponse } from '@shared/models/commons/select-response.interface';
import { Alert } from '@shared/services/alert';
import { Selects } from '@shared/services/selects';
import { TakeExamByIdResponse } from '../../models/take-exam-response.interface';
import { TakeExam } from '../../services/take-exam';
import { CreateTakeExamRequest, UpdateTakeExamRequest } from '../../models/take-exam-request.interface';

@Component({
  selector: 'app-take-exam-management',
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
  templateUrl: './take-exam-management.html',
})
export class TakeExamManagement {
  private readonly fb$ = inject(FormBuilder);
  private readonly takeExamService = inject(TakeExam);
  readonly dialogRef = inject(MatDialogRef<TakeExamManagement>);
  private readonly alert = inject(Alert);
  private readonly selectsService = inject(Selects);

  medics$: SelectResponse[] = [];
  patients$: SelectResponse[] = [];
  analysis$: SelectResponse[] = [];
  exams$: SelectResponse[] = [];
  mode: 'create' | 'update';
  visible = false;
  loading = false;
  takeExamForm!: FormGroup;
  takeExamDialog;

  takeExamDetails: Array<{ examId: number; analysisId: number; takeExamDetailId?: number; examName?: string }> = [];

  initForm(): void {
    this.takeExamForm = this.fb$.group({
      patientId: [''],
      medicId: [''],
      analysisId: [''],
      examId: [''],
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      takeExamsDetail?: TakeExamByIdResponse;
    }
  ) {
    this.mode = data.mode;
    this.takeExamDialog = data.takeExamsDetail;
    this.initForm();
    this.initMode();
  }

  ngOnInit(): void {
    this.getMedicsSelect();
    this.getPatientsSelect();
    this.getAnalysisSelect();
    this.takeExamForm.get('analysisId')?.valueChanges.subscribe((analysisId) => {
      if (analysisId) {
        this.getExamsByAnalysisId(analysisId);
      } else {
        this.exams$ = [];
        this.takeExamForm.get('examId')?.setValue('');
      }
    });
  }
  getAnalysisSelect() {
    this.selectsService.listAnalysis().subscribe({
      next: (response) => {
        this.analysis$ = response;
      },
    });
  }

  getExamsByAnalysisId(analysisId: number) {
    this.selectsService.listExamsByAnalysisId(analysisId).subscribe({
      next: (response) => {
        this.exams$ = response;
      },
    });
  }

  getMedicsSelect() {
    this.selectsService.listMedics().subscribe({
      next: (response) => {
        this.medics$ = response;
      },
    });
  }


  getPatientsSelect() {
    this.selectsService.listPatients().subscribe({
      next: (response) => {
        this.patients$ = response;
      },
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
    // Inicializar detalles para edición
    if (this.takeExamDialog && this.takeExamDialog.takeExamDetails) {
      this.takeExamDetails = this.takeExamDialog.takeExamDetails.map((d: any) => ({
        examId: d.examId,
        analysisId: d.analysisId,
        takeExamDetailId: d.takeExamDetailId,
        examName: d.examName // si existe
      }));
      // Seleccionar el primer análisis y examen del detalle para los selects
      if (this.takeExamDetails.length > 0) {
        const first = this.takeExamDetails[0];
        this.takeExamForm.get('analysisId')?.setValue(first.analysisId);
        this.getExamsByAnalysisId(first.analysisId);
        setTimeout(() => {
          this.takeExamForm.get('examId')?.setValue(first.examId);
        }, 100);
      }
    }
    this.visible = false;
  }

  initCurrentValuesForm() {
    const dialog = this.takeExamDialog;
    this.takeExamForm.patchValue({ ...dialog });
  }

  private createEffect = effect(() => {
    const success = this.takeExamService.getTakeExamCreateSignal();
    if (success !== null) {
      this.loading = false;
      if (success) {
        this.swalResponse({
          isSuccess: true,
          message: 'El examen realizado se ha creado correctamente',
        });
      } else {
        this.swalError('Error al crear el examen realizado');
      }
      (this.takeExamService as any).takeExamCreateSignal.set(null);
    }
  });

  private updateEffect = effect(() => {
    const success = this.takeExamService.getTakeExamUpdateSignal();
    if (success !== null) {
      this.loading = false;
      if (success) {
        this.swalResponse({
          isSuccess: true,
          message: 'El examen realizado se ha actualizado correctamente',
        });
      } else {
        this.swalError('Error al actualizar el examen realizado');
      }
      (this.takeExamService as any).takeExamUpdateSignal.set(null);
    }
  });

    takeExamSave() {
      if (this.takeExamForm.valid && this.takeExamDetails.length > 0) {
        this.loading = true;
        const { patientId, medicId } = this.takeExamForm.getRawValue();
        let data: any;
        if (this.mode === 'update') {
          // Para update, incluir takeExamId y takeExamDetailId
          data = {
            takeExamId: this.takeExamDialog?.takeExamId,
            patientId,
            medicId,
            takeExamDetails: this.takeExamDetails.map((d: any) => ({
              takeExamDetailId: d.takeExamDetailId,
              examId: d.examId,
              analysisId: d.analysisId,
            })),
          };
        } else {
          data = {
            patientId,
            medicId,
            takeExamDetails: this.takeExamDetails.map((d: any) => ({
              examId: d.examId,
              analysisId: d.analysisId,
            })),
          };
        }
        this.takeExamSaveByMode(data);
      }
    }
  
    takeExamSaveByMode(data: CreateTakeExamRequest | UpdateTakeExamRequest) {
      switch (this.mode) {
        case 'create':
          this.takeExamService.takeExamCreate(data as CreateTakeExamRequest);
          break;
        case 'update':
          this.takeExamService.takeExamUpdate(data as UpdateTakeExamRequest);
          break;
      }
    }

    
  addExamDetail(): void {
    const analysisId = this.takeExamForm.get('analysisId')?.value;
    const examId = this.takeExamForm.get('examId')?.value;
    if (analysisId && examId) {
      // Evitar duplicados
      const exists = this.takeExamDetails.some(
        (d: any) => d.analysisId === analysisId && d.examId === examId
      );
      if (!exists) {
        // Buscar el nombre del examen en exams$
        const examObj = this.exams$.find((e: SelectResponse) => e.code === examId);
        const examName = examObj ? examObj.description : undefined;
        // Si estamos en modo update, no hay takeExamDetailId para nuevos
        if (this.mode === 'update') {
          this.takeExamDetails.push({ analysisId, examId, examName });
        } else {
          this.takeExamDetails.push({ analysisId, examId, examName });
        }
        this.takeExamForm.get('examId')?.setValue('');
      }
    }
  }

  removeExamDetail(index: number): void {
    // Si el detalle tiene takeExamDetailId y estamos en update, marcarlo para eliminar en el backend si es necesario
    // Por ahora solo lo quitamos del array local
    this.takeExamDetails.splice(index, 1);
  }

    getAnalysisDescription(analysisId: number): string {
    const found = this.analysis$.find((a: SelectResponse) => a.code === analysisId);
    return found ? found.description : String(analysisId);
  }

  getExamDescription(examId: number, analysisId?: number): string {
    // Buscar en exams$ actual
    let found = this.exams$.find((e: SelectResponse) => e.code === examId);
    // Si no está, buscar en los detalles cargados (para modo update)
    if (!found && this.takeExamDetails) {
      // Buscar por examId y analysisId para mayor precisión
      const detail = this.takeExamDetails.find((d: any) => d.examId === examId && (!analysisId || d.analysisId === analysisId));
      if (detail && detail.examName) return detail.examName;
    }
    return found ? found.description : String(examId);
  }

    // Para edición visual: seleccionar análisis y examen al hacer click en una fila
  editExamDetail(index: number): void {
    const detail = this.takeExamDetails[index];
    this.takeExamForm.get('analysisId')?.setValue(detail.analysisId);
    // Cargar exámenes para ese análisis y luego seleccionar el examen
    this.getExamsByAnalysisId(detail.analysisId);
    setTimeout(() => {
      this.takeExamForm.get('examId')?.setValue(detail.examId);
    }, 100); // Espera breve para asegurar que exams$ se actualice
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
