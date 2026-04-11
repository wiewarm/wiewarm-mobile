import { Component, ElementRef, inject } from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CloseButtonComponent } from '../close-button/close-button.component';
import { IconComponent } from '../icon/icon';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'dialog[app-auth-dialog]',
  templateUrl: './auth-dialog.html',
  styleUrl: './auth-dialog.scss',
  imports: [ReactiveFormsModule, CloseButtonComponent, IconComponent],
  host: {
    'aria-modal': 'true',
    'aria-labelledby': 'auth-login-title',
  },
})
export class AuthDialogComponent implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLDialogElement>);
  readonly auth = inject(AuthService);

  // Open the native dialog after the host element has been rendered.
  ngAfterViewInit() {
    this.elementRef.nativeElement.showModal();
  }
}
