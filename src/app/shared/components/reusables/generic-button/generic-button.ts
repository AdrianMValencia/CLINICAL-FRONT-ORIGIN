import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { GenericButtonModel } from '@shared/models/reusables/generic-button.interface';

@Component({
  selector: 'app-generic-button',
  imports: [MatIcon, MatTooltip],
  templateUrl: './generic-button.html',
})
export class GenericButton {
  @Input() infoButton!: GenericButtonModel;
  @Output() clickButton = new EventEmitter();
}
