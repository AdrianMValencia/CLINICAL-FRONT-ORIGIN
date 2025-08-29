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
import { SelectResponse } from '@shared/models/commons/select-response.interface';
import { Alert } from '@shared/services/alert';
import { Selects } from '@shared/services/selects';
import {
  CreatePatientRequest,
  UpdatePatientRequest,
} from '../../models/patient-request.interface';
import { PatientByIdResponse } from '../../models/patient-response.interface';
import { Patient } from '../../services/patient';

@Component({
  selector: 'app-patient-management',
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
  templateUrl: './patient-management.html',
})
export class PatientManagement {
  private readonly fb$ = inject(FormBuilder);
  private readonly patientService = inject(Patient);
  readonly dialogRef = inject(MatDialogRef<PatientManagement>);
  private readonly alert = inject(Alert);
  private readonly selectsService = inject(Selects);

  documentTypes$: SelectResponse[] = [];
  ageTypes$: SelectResponse[] = [];
  genders$: SelectResponse[] = [];

  mode: 'create' | 'update';
  patientForm!: FormGroup;
  patientDialog;

  initForm(): void {
    this.patientForm = this.fb$.group({
      patientId: [0, [Validators.required]],
      names: [''],
      lastName: [''],
      motherMaidenName: [''],
      phone: [''],
      typeAgeId: [''],
      age: [''],
      documentTypeId: [''],
      documentNumber: [''],
      genderId: [''],
    });
  }
  private createEffect = effect(() => {
    const success = this.patientService.getPatientCreateSignal();
    if (success !== null) {
      if (success) {
        this.swalResponse({
          isSuccess: true,
          message: 'Paciente creado correctamente',
        });
      } else {
        this.swalError('Error al crear el paciente');
      }
      (this.patientService as any).patientCreateSignal.set(null);
    }
  });

  private updateEffect = effect(() => {
    const success = this.patientService.getPatientUpdateSignal();
    if (success !== null) {
      if (success) {
        this.swalResponse({
          isSuccess: true,
          message: 'Paciente actualizado correctamente',
        });
      } else {
        this.swalError('Error al actualizar el paciente');
      }
      (this.patientService as any).patientUpdateSignal.set(null);
    }
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mode: 'create' | 'update';
      patientsDetail?: PatientByIdResponse;
    }
  ) {
    this.mode = data.mode;
    this.patientDialog = data.patientsDetail;
    this.initForm();
    this.initMode();
  }

  ngOnInit(): void {
    this.getDocumentTypesSelect();
    this.getAgeTypesSelect();
    this.getGendersSelect();
  }

  getDocumentTypesSelect() {
    this.selectsService.listDocumentTypes().subscribe({
      next: (response) => {
        this.documentTypes$ = response;
      },
    });
  }

  getAgeTypesSelect() {
    this.selectsService.listAgeTypes().subscribe({
      next: (response) => {
        this.ageTypes$ = response;
      },
    });
  }

  getGendersSelect() {
    this.selectsService.listGenders().subscribe({
      next: (response) => {
        this.genders$ = response;
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
    const dialog = this.patientDialog;
    this.patientForm.patchValue({
      ...dialog,
    });
  }

  patientSave() {
    if (this.patientForm.valid) {
      let data = this.patientForm.getRawValue();
      this.patientSaveByMode(data);
    }
  }

  patientSaveByMode(data: CreatePatientRequest | UpdatePatientRequest) {
    switch (this.mode) {
      case 'create':
        this.patientService.patientCreate(data as CreatePatientRequest);
        break;
      case 'update':
        this.patientService.patientUpdate(data as UpdatePatientRequest);
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
