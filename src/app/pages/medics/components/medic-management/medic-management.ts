import { Component, effect, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
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
import { InputDate } from '@shared/components/reusables/input-date/input-date';
import { InputSelect } from '@shared/components/reusables/input-select/input-select';
import { InputText } from '@shared/components/reusables/input-text/input-text';
import { SelectResponse } from '@shared/models/commons/select-response.interface';
import { Alert } from '@shared/services/alert';
import { Selects } from '@shared/services/selects';
import { CUSTOM_DATE_FORMATS } from '@shared/utils/consts.util';
import {
  CreateMedicsRequest,
  UpdateMedicsRequest,
} from '../../models/medics-request.interface';
import { MedicsByIdResponse } from '../../models/medics-response.interface';
import { Medics } from '../../services/medics';

@Component({
  selector: 'app-medic-management',
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
    InputDate,
  ],
  templateUrl: './medic-management.html',
  providers: [
    MatDatepickerModule,
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
})
export class MedicManagement {
  private readonly fb$ = inject(FormBuilder);
  private readonly medicsService = inject(Medics);
  readonly dialogRef = inject(MatDialogRef<MedicManagement>);
  private readonly alert = inject(Alert);
  private readonly selectsService = inject(Selects);

  documentTypes$: SelectResponse[] = [];
  specialties$: SelectResponse[] = [];

  mode: 'create' | 'update';
  medicsForm!: FormGroup;
  medicsDialog;

  initForm(): void {
    this.medicsForm = this.fb$.group({
      medicId: [0, [Validators.required]],
      names: [''],
      lastName: [''],
      motherMaidenName: [''],
      address: [''],
      phone: [''],
      birthDate: [''],
      documentTypeId: [''],
      documentNumber: [''],
      specialtyId: [''],
    });
  }
  private createEffect = effect(() => {
    const success = this.medicsService.getMedicsCreateSignal();
    if (success !== null) {
      if (success) {
        this.swalResponse({
          isSuccess: true,
          message: 'Médico creado correctamente',
        });
      } else {
        this.swalError('Error al crear el médico');
      }
      (this.medicsService as any).medicsCreateSignal.set(null);
    }
  });

  private updateEffect = effect(() => {
    const success = this.medicsService.getMedicsUpdateSignal();
    if (success !== null) {
      if (success) {
        this.swalResponse({
          isSuccess: true,
          message: 'Médico actualizado correctamente',
        });
      } else {
        this.swalError('Error al actualizar el médico');
      }
      (this.medicsService as any).medicsUpdateSignal.set(null);
    }
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      medicsDetail?: MedicsByIdResponse;
    }
  ) {
    this.mode = data.mode;
    this.medicsDialog = data.medicsDetail;
    this.initForm();
    this.initMode();
  }

  ngOnInit(): void {
    this.getDocumentTypesSelect();
    this.getSpecialtySelect();
  }

  getDocumentTypesSelect() {
    this.selectsService.listDocumentTypes().subscribe({
      next: (response) => {
        this.documentTypes$ = response;
      },
    });
  }

  getSpecialtySelect() {
    this.selectsService.listSpecialty().subscribe({
      next: (response) => {
        this.specialties$ = response;
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
  }

  initCurrentValuesForm() {
    const dialog = this.medicsDialog;
    const birthDate = dialog!.birthDate ? new Date(dialog!.birthDate) : null;
    this.medicsForm.patchValue({
      ...dialog,
      birthDate: birthDate ? birthDate.toISOString().split('T')[0] : null,
    });
  }

  medicsSave() {
    if (this.medicsForm.valid) {
      let data = this.medicsForm.getRawValue();
      this.medicsSaveByMode(data);
    }
  }

  medicsSaveByMode(data: CreateMedicsRequest | UpdateMedicsRequest) {
    switch (this.mode) {
      case 'create':
        this.medicsService.medicsCreate(data as CreateMedicsRequest);
        break;
      case 'update':
        this.medicsService.medicsUpdate(data as UpdateMedicsRequest);
        break;
    }
  }

  swalResponse(response: any) {
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
    this.alert.error('Error', errorResponse);
  }
}
