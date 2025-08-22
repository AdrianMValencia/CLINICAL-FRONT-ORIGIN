import { NgClass } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { GenericValidators } from '@app/shared/utils/generic-validators.util';

@Component({
  selector: 'app-input-text',
  imports: [MatInputModule, ReactiveFormsModule, NgClass],
  templateUrl: './input-text.html',
})
export class InputText {
  @Input() submitted: boolean = false;
  @Input() inputControl: FormControl | any = new FormControl(null);
  @Input() label: string = 'Input';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() onlyText?: boolean = false;
  @Input() mode!: 'create' | 'read' | 'update';
  @Input() isLoading: boolean = false;
  @Input() withLabel: boolean = true;
  @Input() maxLength: number = 100;
  @Input() prefix_suffix: { label: string; mode: 'prefix' | 'suffix' } = {
    label: '',
    mode: 'prefix',
  };
  @Input() validatorType: string = '';
  @Input() isAmount: boolean = false;
  @Input() type: string = 'text';
  validator: any = [];

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    for (let property in changes) {
      if (property === 'mode') {
        this.initMode();
      }
      if (property === 'required') {
        this.setValidators();
      }
    }
  }

  ngOnInit(): void {
    this.initMode();
    this.setOneError();
    if (this.isAmount) {
      const val = this.inputControl.value;
      if (val != null && val !== '') {
        this.inputControl.setValue({ emitEvent: false });
      }
    }
  }

  private initMode() {
    this.setValidators();
    switch (this.mode) {
      case 'create':
        this.inputControl.enable();
        break;
      case 'read':
        this.inputControl.disable();
        break;
      case 'update':
        if (this.inputControl.value != null) this.inputControl.enable();
        break;
      default:
        break;
    }
  }

  setOneError() {
    this.inputControl.valueChanges.subscribe(() => {
      if (this.inputControl.errors) {
        let claves = Object.keys(this.inputControl.errors);
        let clave: string = claves[0];
        let error: any = {};
        error[clave] = this.inputControl.errors[clave];
        this.inputControl.setErrors(error);
      } else {
        this.inputControl.setErrors(null);
      }
    });
  }

  get placeholderValue() {
    return this.mode !== 'read' ? this.placeholder : '';
  }

  setValidators() {
    this.validator = [];
    this.validator.push(Validators.minLength(1));
    this.validator.push(Validators.maxLength(this.maxLength));

    if (this.required) {
      this.validator.push(Validators.required);
      this.validator.push(GenericValidators.notOnlyWhitespaceValidator);
    }

    if (this.onlyText) {
      this.validator.push(GenericValidators.onlyTextOrSpaceValidator);
    }
    this.inputControl.setValidators(this.validator);
    this.inputControl.updateValueAndValidity();
  }
}
