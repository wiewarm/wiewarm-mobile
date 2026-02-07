import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { IconComponent } from '../icon/icon';
import { RouterLink } from '@angular/router';
import { ExternalLinkDirective } from '../../directives/external-link';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.html',
  styleUrls: ['./menu-bar.scss'],
  imports: [IconComponent, RouterLink, ExternalLinkDirective],
})
export class MenuBarComponent {
  protected menuOpen = signal(false);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  // Close menu when clicking outside this component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.menuOpen()) return;

    const target = event.target;
    if (!(target instanceof Node)) return;
    if (this.elementRef.nativeElement.contains(target)) return;

    this.closeMenu();
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    this.closeMenu();
  }
}
