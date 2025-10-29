import { Component, signal } from '@angular/core';
import { IconComponent } from '../icon/icon';
import { MenuBarComponent } from '../menu-bar/menu-bar';

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
export class HeaderComponent {
  protected title = 'wiewarm.ch';
  
  protected darkMode = signal(false);
  protected menuOpen = signal(false);

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    document.body.classList.toggle('dark-mode', this.darkMode());
  }

  toggleMenu() {
    this.menuOpen.set(!this.menuOpen());
  }

  closeMenu() {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
    }
  }
}
