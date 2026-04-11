import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import type { OnInit } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { AuthService } from '../../../../shared/services/auth/auth.service';
import { BadResourceService } from '../../../../shared/services/bad.service';
import type { BadDetail } from '../../../../shared/services/interfaces/bad-detail.interface';

interface AddressFormModel {
  adresse1: string;
  adresse2: string;
  plz: string;
  ort: string;
  telefon: string;
  email: string;
  www: string;
}

@Component({
  selector: 'app-address-item-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField],
  templateUrl: './address-item-edit.component.html',
  styleUrl: './address-item-edit.component.scss',
})
export class AddressItemEditComponent implements OnInit {
  readonly detail = input.required<BadDetail>();

  private readonly badService = inject(BadResourceService);
  private readonly authService = inject(AuthService);

  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal(false);

  readonly model = signal<AddressFormModel>({
    adresse1: '',
    adresse2: '',
    plz: '',
    ort: '',
    telefon: '',
    email: '',
    www: '',
  });

  readonly addressForm = form(this.model, (f) => {
    required(f.adresse1);
    required(f.plz);
    required(f.ort);
  });

  ngOnInit() {
    const d = this.detail();
    this.model.set({
      adresse1: d.adresse1 ?? '',
      adresse2: d.adresse2 ?? '',
      plz: d.plz,
      ort: d.ort,
      telefon: d.telefon ?? '',
      email: d.email ?? '',
      www: d.www ?? '',
    });
  }

  async save() {
    const detail = this.detail();
    const credential = this.authService.getEditCredential();
    if (!credential) {
      this.error.set('Sitzung abgelaufen. Bitte erneut anmelden.');
      return;
    }

    this.error.set('');
    this.success.set(false);

    await submit(this.addressForm, async () => {
      this.loading.set(true);
      try {
        await this.badService.updateBad({
          badid: detail.badid,
          pincode: credential,
          // The legacy API expects these optional keys to be present on update,
          // even when this form does not edit them.
          zeiten: detail.zeiten ?? '',
          preise: detail.preise ?? '',
          info: detail.info ?? '',
          ...this.model(),
        });
        this.success.set(true);
      } catch {
        this.error.set('Speichern fehlgeschlagen. Bitte erneut versuchen.');
      } finally {
        this.loading.set(false);
      }
    });
  }
}
