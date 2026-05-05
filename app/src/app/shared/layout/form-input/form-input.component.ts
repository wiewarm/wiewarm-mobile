import { Component, input, model } from '@angular/core';
import type {
  FormValueControl,
  WithOptionalField,
  ValidationError,
} from '@angular/forms/signals';

@Component({
  selector: 'app-form-input',
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
})
export class FormInputComponent implements FormValueControl<string> {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly type = input<string>('text');
  readonly autocomplete = input<string>();
  readonly placeholder = input<string>();
  readonly errorText = input<string>('Pflichtfeld');

  // FormValueControl<string> — used from [formField]-Directive
  readonly value = model<string>('');
  readonly invalid = input<boolean>(false);
  readonly touched = model<boolean>(false);
  // For validator-specific errors
  readonly errors = input<readonly WithOptionalField<ValidationError>[]>([]);
}
