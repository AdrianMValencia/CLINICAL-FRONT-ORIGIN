import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { scaleInOutAnimation } from '@shared/animations/scale-in-out.animation';
import { SelectResponse } from '@shared/models/commons/select-response.interface';
import { GenericValidators } from '@shared/utils/generic-validators.util';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-input-select',
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './input-select.html',
  animations: [scaleInOutAnimation]
})
export class InputSelect {
  onOptionSelected(event: any) {
    const code = event.option.value;
    this.inputControl.setValue(code);
    this.selectionChange.emit(code);
  }
  @Input() submitted: boolean = false;
  @Input() inputControl: FormControl | any = new FormControl({
    value: null,
    disabled: this.mode === 'read',
  });
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() aOptions: SelectResponse[] = [];
  @Input() applyVisibility: boolean = false;
  @Input() required: boolean = false;
  @Input() mode?: 'create' | 'read' | 'update';
  @Input() isLoading: boolean = false;
  @Input() withLabel: boolean = true;
  @Input() hint_message: string = '';
  filteredOptions?: Observable<any>;
  aCodes: any = [];
  @Output() selectionChange = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges) {
    for (let property in changes) {
      if (property === 'aOptions') {
        this.visibleOptions();
        this.setCodesOptions();
        this.initMode();
        this.setValidators();
        if (this.inputControl && this.inputControl.value) {
          const currentValue = this.inputControl.value;
          const found = this.aOptions.find(
            (opt) => opt.description === currentValue
          );
          if (found) {
            this.inputControl.setValue(found.code);
          } else {
            this.inputControl.setValue(currentValue);
          }
        }
      }
      if (property === 'mode') {
        this.initMode();
      }
      if (property === 'required') {
        this.setValidators();
      }
    }
  }

  initMode() {
    switch (this.mode) {
      case 'create':
        this.inputControl.enable();
        this.autocomplete();
        break;
      case 'read':
        this.inputControl.disable();
        break;
      case 'update':
        this.inputControl.enable();
        this.autocomplete();
        break;
      default:
        break;
    }
  }

  setValidators() {
    let validator = [];

    validator.push(GenericValidators.optionExistInArray(this.aCodes));

    validator.push(GenericValidators.emptyArrayOptions(this.aOptions));

    if (this.required) {
      validator.push(Validators.required);
    }

    this.inputControl.setValidators(validator);
    this.inputControl.updateValueAndValidity();
  }

  autocomplete() {
    this.filteredOptions = this.inputControl.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return typeof value == 'string' ? this.filter(value) : this.visible();
      })
    );
  }

  private visible() {
    return this.aOptions.filter((option: any) => option.visible);
  }

  private filter(value: any) {
    const filterValue = value.toLowerCase();
    return this.aOptions.filter(
      (option: any) =>
        option.description.toLowerCase().includes(filterValue) && option.visible
    );
  }

  visibleOptions() {
    this.aOptions.map((option: any) => {
      if (option.visible == undefined) {
        option.visible = true;
      }
    });
  }

  setCodesOptions() {
    this.aCodes = this.aOptions.map((option) => option.code);
  }

  setVisibleOptions(option: any, visible: any) {
    if (this.applyVisibility) {
      this.aOptions.map((optionA: SelectResponse) => {
        if (optionA.code === option) {
          optionA.visible = visible;
        }
      });
    }
  }

  showDropdrown(sCodigo: number): any {
    let selectValue = null;
    if (sCodigo) {
      let Opcion = this.aOptions.find(
        (opcion: SelectResponse) => opcion.code === sCodigo
      );
      selectValue = Opcion != undefined ? Opcion.description : null;
    }
    return selectValue;
  }
}
