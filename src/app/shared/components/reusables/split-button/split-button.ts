import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { SplitButtonModel } from '@app/shared/models/reusables/split-button.interface';

@Component({
  selector: 'app-split-button',
  imports: [MatTooltip, MatIcon, MatMenuTrigger, MatMenu, NgClass],
  templateUrl: './split-button.html',
})
export class SplitButton {
  splitButton: SplitButtonModel = {
    type: 'button',
    label: '',
    icon: null!,
    value: 0,
  };

  icArrowDropDown = 'arrow_drop_down';

  @Input() configButtons: SplitButtonModel[] = [];
  @Output() doThisFunction = new EventEmitter<number>();

  actionsArray: SplitButtonModel[] = [];

  ngOnInit(): void {
    this.buildButton();
  }

  buildButton() {
    this.configButtons.forEach((element) => {
      if (element.type == 'button') {
        this.splitButton.icon = element.icon;
        this.splitButton.label = element.label;
        this.splitButton.value = element.value;
      } else {
        this.actionsArray.push(element);
      }
    });
  }

  setAction(action: number) {
    this.doThisFunction.emit(action);
  }
}
