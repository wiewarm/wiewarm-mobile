import { Component, inject } from '@angular/core';
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
export class HeaderComponent {
  protected title = 'wiewarm.ch';
  private readonly themeService = inject(ThemeService);

  protected darkMode = this.themeService.darkMode;

  toggleDarkMode() {
    this.themeService.toggle();
  }
}
