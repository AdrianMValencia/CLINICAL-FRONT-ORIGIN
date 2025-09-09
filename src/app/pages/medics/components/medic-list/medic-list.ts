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
import { MedicsResponse } from '../../models/medics-response.interface';
import { Medics } from '../../services/medics';
import { MedicManagement } from '../medic-management/medic-management';
import { componentMedicsSetting } from './medics-list.config';

@Component({
  selector: 'app-medic-list',
  imports: [MatIcon, ListTable, GenericButton, SplitButton, SearchBox],
  templateUrl: './medic-list.html',
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class MedicList {
  public readonly medicsService = inject(Medics);
  public readonly dialog = inject(MatDialog);
  public readonly componentMedics$ = componentMedicsSetting;

  iconMedics$ = 'person_add';
  resetChecks: boolean = false;

  newMedics(): void {
    this.dialog
      .open(MedicManagement, {
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
        data: { mode: 'create' },
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.setGetInputsMedics(true);
        }
      });
  }

  rowClick(rowClick: RowClick<MedicsResponse>) {
    let action = rowClick.action;
    let medics = rowClick.row;

    switch (action) {
      case 'edit':
        this.medicsEdit(medics);
        break;
      case 'delete':
        this.medicsDelete(medics);
        break;
    }
  }

  private medicsDetailEffect = effect(() => {
    const medicsDetail = this.medicsService.getMedicsByIdSignal();
    if (medicsDetail) {
      let dialogRef = this.dialog.open(MedicManagement, {
        data: { mode: 'update', medicsDetail },
        disableClose: true,
        width: '500px',
        enterAnimationDuration: 250,
        exitAnimationDuration: 250,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) this.setGetInputsMedics(true);

        this.medicsService['medicsByIdSignal'].set(null);
      });
    }
  });

  async medicsEdit(medicsData: MedicsResponse) {
    this.medicsService.medicsById(medicsData.medicId);
  }

  medicsDelete(medicsData: MedicsResponse) {
    Swal.fire({
      title: 'Eliminar médico',
      text: `¿Realmente deseas eliminar el médico ${medicsData.names} ${medicsData.surnames}?`,
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
        this.medicsService.medicsDelete(medicsData.medicId);
        this.setGetInputsMedics(true);
      }
    });
  }

  setGetInputsMedics(refresh: boolean) {
    if (!this.componentMedics$) return;

    this.componentMedics$.filters.refresh = refresh;
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = '';
    if (!this.componentMedics$) return;

    if (this.componentMedics$.filters.textFilter != null) {
      str += `&numFilter=${this.componentMedics$.filters.numFilter}&textFilter=${this.componentMedics$.filters.textFilter}`;
    }

    if (this.componentMedics$.filters.refresh == true) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.componentMedics$.filters.refresh = false;
    }

    this.componentMedics$.getInputs = str;
  }

  search(data: SearchBoxModel) {
    if (!this.componentMedics$) return;
    this.componentMedics$.filters.numFilter = data.searchValue;
    this.componentMedics$.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  resetButton(action: Actions) {
    if (!this.componentMedics$) return;

    switch (action) {
      case 1:
        this.componentMedics$.filters.refresh = true;
        this.formatGetInputs();
        break;
      case 2:
        this.initFilterReset();
        this.resetChecks = !this.resetChecks;
        break;
    }
  }

  initFilterReset() {
    if (!this.componentMedics$) return;

    this.componentMedics$.filters = {
      ...this.componentMedics$.initFilters,
    };
    this.formatGetInputs();
  }

  private medicsChangeStateEffect = effect(() => {
    const changed = this.medicsService.getMedicsChangeStateSignal();
    if (changed === true) {
      this.setGetInputsMedics(true);
      this.medicsService['medicsChangeStateSignal'].set(null);
    }
  });

  async onBadgeClick(event: {
    row: MedicsResponse;
    column: TableColumns<unknown>;
  }) {
    const currentState = event.row.stateMedic.label === 'ACTIVO' ? 1 : 0;
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
      this.medicsService.medicsChangeState(event.row.medicId, newState);
    }
  }
}
