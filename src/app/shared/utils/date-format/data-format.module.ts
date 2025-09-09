import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MomentDateModule } from "@angular/material-moment-adapter";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MY_DATE_FORMATS } from "./date-format";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [MomentDateModule],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class DateFormatModule {}
