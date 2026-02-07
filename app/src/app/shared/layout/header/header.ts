import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
} from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { MenuBarComponent } from '../menu-bar/menu-bar';
import { ThemeService } from '../../services/storage/theme.service';

@Component({
  selector: 'header[app-header]',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  imports: [IconComponent, MenuBarComponent],
  host: {
    role: 'banner', // a11y: Landmark
    class: 'app-header',
  },
})
export class HeaderComponent implements AfterViewInit {
  protected title = 'wiewarm.ch';
  protected subtitle = 'dein Badiportal..';
  private readonly themeService = inject(ThemeService);
  private readonly elRef = inject(ElementRef<HTMLElement>);
  private lastScrollY = 0;
  private readonly nearTopPx = 8;
  private readonly minDeltaPx = 4;

  @HostBinding('class.is-hidden')
  protected isHidden = false;

  protected darkMode = this.themeService.darkMode;

  ngAfterViewInit(): void {
    this.updateHeaderHeight();
    this.lastScrollY = window.scrollY || 0;
  }

  toggleDarkMode() {
    this.themeService.toggle();
  }

  /**
   * The component uses a CSS custom property `--app-header-height` to communicate its height to the rest of the application.
   * The header automatically hides when the user scrolls down more than {@link minDeltaPx} pixels and is not near the top,
   * and shows when the user scrolls up or is within {@link nearTopPx} pixels from the top.
   */
  @HostListener('window:resize')
  onResize() {
    this.updateHeaderHeight();
  }

  @HostListener('window:scroll')
  onScroll() {
    const current = window.scrollY || 0;
    const delta = current - this.lastScrollY;
    const hide = !this.isNearTop(current) && delta > this.minDeltaPx;
    const show = this.isNearTop(current) || delta < -this.minDeltaPx;

    if (hide) this.isHidden = true;
    if (show) this.isHidden = false;

    this.lastScrollY = current;
  }

  private updateHeaderHeight() {
    const height = this.elRef.nativeElement.offsetHeight;
    document.documentElement.style.setProperty(
      '--app-header-height',
      `${height}px`,
    );
  }

  private isNearTop(scrollY: number) {
    return scrollY < this.nearTopPx;
  }
}
