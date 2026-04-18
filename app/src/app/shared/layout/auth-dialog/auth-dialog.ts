import {
  Component,
  ElementRef,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { FormField, form, required, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { EditBase } from '../../edit.base';
import { CloseButtonComponent } from '../close-button/close-button';
import { FormInputComponent } from '../form-input/form-input.component';
import { IconComponent } from '../icon/icon';
import { BadResourceService } from '../../services/bad.service';
import type { LoginModel } from '../../services/interfaces/auth.interface';

@Component({
  selector: 'dialog[app-auth-dialog]',
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss',
  imports: [FormField, FormInputComponent, CloseButtonComponent, IconComponent],
  host: {
    'aria-modal': 'true',
    'aria-labelledby': 'auth-login-title',
  },
})
export class AuthDialogComponent extends EditBase implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLDialogElement>);
  private readonly router = inject(Router);
  private readonly badService = inject(BadResourceService);

  private readonly prefillBadId = signal('');

  readonly loginModel = linkedSignal<LoginModel>(() => ({
    badId: this.prefillBadId(),
    pincode: '',
  }));

  readonly loginForm = form(this.loginModel, (f) => {
    required(f.badId);
    required(f.pincode);
  });

  async ngAfterViewInit() {
    this.elementRef.nativeElement.showModal();
    const badId = await this.getCurrentRouteBadId();
    if (badId != null) {
      this.prefillBadId.set(String(badId));
    }
  }

  async login() {
    await submit(this.loginForm, () =>
      this.save(async () => {
        const { badId, pincode } = this.loginModel();
        await this.auth.doLogin(Number(badId), pincode);
        this.elementRef.nativeElement.close();
      }, 'Login fehlgeschlagen. Bitte Daten prüfen.'),
    );
  }

  close() {
    this.elementRef.nativeElement.close();
  }

  logout() {
    this.auth.logout();
    this.elementRef.nativeElement.close();
  }

  private get currentRouteSlug(): string | null {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) route = route.firstChild;
    return route.paramMap.get('id');
  }

  private async getCurrentRouteBadId(): Promise<number | null> {
    const slug = this.currentRouteSlug;
    if (!slug) return null;
    try {
      const detail = await this.badService.getDetail(slug);
      return detail.badid;
    } catch {
      return null;
    }
  }
}
