import { CommonModule, NgClass } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { scaleInOutAnimation } from '@app/shared/animations/scale-in-out.animation';
import { SearchBoxModel, SearchOptions } from '@app/shared/models/reusables/search-options.interface';

@Component({
  selector: 'app-search-box',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIcon,
    MatTooltip,
    NgClass,
    MatMenuModule,
  ],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
  animations: [scaleInOutAnimation],
})
export class SearchBox {
  private readonly fb = inject(FormBuilder);

  form$!: FormGroup;

  @Input() searchOptions!: SearchOptions[];
  @Input() currentValue: string = '';
  @Output() search = new EventEmitter<SearchBoxModel>();

  labelSelection: SearchOptions = {
    label: '',
    value: 0,
    placeholder: '',
    validation: '',
    validation_desc: '',
    icon: '',
  };

  ngOnInit(): void {
    this.form$ = this.fb.group({
      searchValue: [''],
      searchData: [''],
    });

    this.changeSelection(this.searchOptions[0]);
    this.form$.controls['searchData'].valueChanges.subscribe((e) => {
      if (e.trim() == '') {
        this.submit();
      }
    });
  }

  changeSelection(option: SearchOptions) {
    this.labelSelection = option;
    this.form$.controls['searchValue'].setValue(option.value);
    this.labelSelection.validation_desc = option.validation_desc
      ? option.validation_desc
      : '';
    let min_length = option.min_length ? option.min_length : 1;
    this.setSearchStringValidation(option.validation, min_length);
  }

  setSearchStringValidation(validation: [], minLength: number) {
    let searchData = this.form$.get('searchData');

    let setValidation = [];
    setValidation.push(Validators.required);
    setValidation.push(Validators.minLength(minLength));
    if (validation) {
      validation.forEach((e) => {
        setValidation.push(e);
      });
    }
    searchData!.setValidators(setValidation);
  }

  submit() {
    let data = this.form$.getRawValue();
    this.search.emit(data);
  }

  reset() {
    this.form$.controls['searchData'].setValue('');
    this.submit();
  }
}
