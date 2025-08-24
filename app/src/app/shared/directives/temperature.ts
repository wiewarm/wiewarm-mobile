import {
  Directive,
  HostBinding,
  input,
  computed,
  numberAttribute,
} from '@angular/core';
import { temperatureClass } from 'src/app/shared/util/temperature.util';

@Directive({
  selector: '[temperature]',
})
export class TemperatureDirective {
  temperature = input<number | null, any>(null, {
    transform: (v) => (v == null || v === '' ? null : numberAttribute(v)),
  });

  private cssClass = computed(() => temperatureClass(this.temperature()));

  @HostBinding('class')
  get hostClass() {
    return this.cssClass();
  }
}
