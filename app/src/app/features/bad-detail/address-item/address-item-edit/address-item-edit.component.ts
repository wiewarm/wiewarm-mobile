import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { EditBase } from '../../../../shared/edit.base';
import { EditFeedbackComponent } from '../../../../shared/layout/edit-feedback/edit-feedback';
import { FormInputComponent } from '../../../../shared/layout/form-input/form-input.component';
import type { BadDetail } from '../../../../shared/services/interfaces/bad-detail.interface';
import { BadResourceService } from 'src/app/shared/services/bad.service';
import type { AddressFormModel } from 'src/app/shared/services/interfaces/address-form.interface';

@Component({
  selector: 'app-address-item-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, FormInputComponent, EditFeedbackComponent],
  templateUrl: './address-item-edit.component.html',
  styleUrl: './address-item-edit.component.scss',
})
export class AddressItemEditComponent extends EditBase {
  protected readonly badService = inject(BadResourceService);
  readonly detail = input.required<BadDetail>();
  readonly saved = output<void>();

  readonly model = linkedSignal<BadDetail, AddressFormModel>({
    source: this.detail,
    computation: (d) => ({
      adresse1: d.adresse1 ?? '',
      adresse2: d.adresse2 ?? '',
      plz: d.plz,
      ort: d.ort,
      telefon: d.telefon ?? '',
      email: d.email ?? '',
      www: d.www ?? '',
    }),
  });

  readonly addressForm = form(this.model, (f) => {
    required(f.adresse1);
    required(f.plz);
    required(f.ort);
  });

  async saveAddress() {
    await submit(this.addressForm, () =>
      this.save(() =>
        this.badService.updateBadFields(this.detail().badid, this.model()),
      ),
    );
    // ToDo: maybe optimize
    if (this.success()) {
      this.saved.emit();
    }
  }
}
