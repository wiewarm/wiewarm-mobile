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
  protected isMenuOpen = signal(false);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly toggle = () => this.isMenuOpen.update((open) => !open);
  readonly close = () => this.isMenuOpen.set(false);

  // Close menu when clicking outside this component
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.isMenuOpen()) return;

    const target = event.target;
    if (!(target instanceof Node)) return;
    if (this.elementRef.nativeElement.contains(target)) return;

    this.close();
  }

  @HostListener('document:keydown.escape')
  readonly onEscape = () => this.close();
}
