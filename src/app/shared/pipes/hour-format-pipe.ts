import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourFormat',
})
export class HourFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const hourMinutes = value.split(':');
    const hour = parseInt(hourMinutes[0]);
    const minutes = parseInt(hourMinutes[1]);

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
  }
}
