import { Component, ElementRef, inject, signal } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { RouterLink } from '@angular/router';
import { ExternalLinkDirective } from '../../directives/external-link';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.html',
  styleUrls: ['./menu-bar.scss'],
  imports: [IconComponent, RouterLink, ExternalLinkDirective],
  host: {
    '(document:keydown.escape)': 'closeMenu()',
    '(document:click)': 'onDocumentClick($event)',
  },
})
export class MenuBarComponent {
  protected isMenuOpen = signal(false);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly toggle = () => this.isMenuOpen.update((open) => !open);
  readonly closeMenu = () => this.isMenuOpen.set(false);

  // Closes the menu when clicking outside this component
  onDocumentClick(event: MouseEvent) {
    if (!this.isMenuOpen()) return;

    const target = event.target;
    if (!(target instanceof Node)) return;
    if (this.elementRef.nativeElement.contains(target)) return;

    this.closeMenu();
  }
}
