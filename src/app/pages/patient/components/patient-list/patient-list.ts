import { Component, effect, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { fadeInRight400ms } from '@shared/animations/fade-in-right.animation';
import { scaleIn400ms } from '@shared/animations/scale-in.animation';
import { GenericButton } from '@shared/components/reusables/generic-button/generic-button';
import { ListTable } from '@shared/components/reusables/list-table/list-table';
import { SearchBox } from '@shared/components/reusables/search-box/search-box';
import { SplitButton } from '@shared/components/reusables/split-button/split-button';
import { TableColumns } from '@shared/models/reusables/list-table.interface';
import { RowClick } from '@shared/models/reusables/rowclick-interface';
import { SearchBoxModel } from '@shared/models/reusables/search-options.interface';
import { Actions } from '@shared/models/reusables/split-button.interface';
import Swal from 'sweetalert2';
import { PatientResponse } from '../../models/patient-response.interface';
import { Patient } from '../../services/patient';
import { PatientManagement } from '../patient-management/patient-management';
import { componentPatientSetting } from './patient-list.config';

@Component({
  selector: 'app-patient-list',
  imports: [MatIcon, ListTable, GenericButton, SplitButton, SearchBox],
  templateUrl: './patient-list.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class PatientList {
  public readonly patientService = inject(Patient);
  public readonly dialog = inject(MatDialog);
  public readonly componentPatients$ = componentPatientSetting;

  iconPatient$ = 'personal_injury';
  resetChecks: boolean = false;

  newPatient(): void {
    this.dialog
      .open(PatientManagement, {
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsPatients(true);
        }
      });
  }

  rowClick(rowClick: RowClick<PatientResponse>) {
    let action = rowClick.action;
    let patient = rowClick.row;

    switch (action) {
      case 'edit':
        this.patientEdit(patient);
        break;
      case 'delete':
        this.patientDelete(patient);
        break;
    }
  }

  private patientsDetailEffect = effect(() => {
    const patientsDetail = this.patientService.getPatientByIdSignal();
    if (patientsDetail) {
      let dialogRef = this.dialog.open(PatientManagement, {
        data: { mode: 'update', patientsDetail },
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) this.setGetInputsPatients(true);

        this.patientService['patientByIdSignal'].set(null);
      });
    }
  });

  async patientEdit(patientsData: PatientResponse) {
    this.patientService.patientById(patientsData.patientId);
  }

  patientDelete(patientsData: PatientResponse) {
    Swal.fire({
      title: 'Eliminar paciente',
      text: `¿Realmente deseas eliminar el paciente ${patientsData.names} ${patientsData.surnames}?`,
      icon: 'warning',
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar',
      width: 430,
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientService.patientDelete(patientsData.patientId);
        this.setGetInputsPatients(true);
      }
    });
  }

  setGetInputsPatients(refresh: boolean) {
    if (!this.componentPatients$) return;

    this.componentPatients$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = '';
    if (!this.componentPatients$) return;

    if (this.componentPatients$.filters.textFilter != null) {
      str += `&numFilter=${this.componentPatients$.filters.numFilter}&textFilter=${this.componentPatients$.filters.textFilter}`;
    }

    if (this.componentPatients$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentPatients$.filters.refresh = false;
    }

    this.componentPatients$.getInputs = str;
  }

  search(data: SearchBoxModel) {
    if (!this.componentPatients$) return;
    this.componentPatients$.filters.numFilter = data.searchValue;
    this.componentPatients$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    if (!this.componentPatients$) return;

    switch (action) {
      case 1:
        this.componentPatients$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  initFilterReset() {
    if (!this.componentPatients$) return;

    this.componentPatients$.filters = {
      ...this.componentPatients$.initFilters,
    };
    this.formatGetInputs();
  }

  private patientsChangeStateEffect = effect(() => {
    const changed = this.patientService.getPatientChangeStateSignal();
    if (changed === true) {
      this.setGetInputsPatients(true);
      this.patientService['patientChangeStateSignal'].set(null);
    }
  });

  async onBadgeClick(event: {
    row: PatientResponse;
    column: TableColumns<unknown>;
  }) {
    const currentState = event.row.statePatient.label === 'ACTIVO' ? 1 : 0;
    const newState = currentState === 1 ? 0 : 1;

    const confirm = await Swal.fire({
      title: '¿Cambiar estado?',
      text: `¿Seguro que deseas cambiar el estado a ${
        newState === 1 ? 'ACTIVO' : 'INACTIVO'
      }?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#004A89',
      cancelButtonColor: '#9c667d',
      width: 430,
    });

    if (confirm.isConfirmed) {
      this.patientService.patientChangeState(event.row.patientId, newState);
    }
  }
}
