import { Component, signal } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.html',
  styleUrls: ['./menu-bar.scss'],
  imports: [IconComponent, RouterLink],
})
export class MenuBarComponent {
  protected menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }
}
