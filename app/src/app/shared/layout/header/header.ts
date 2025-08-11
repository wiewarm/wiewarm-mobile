import { Component, signal } from '@angular/core';

@Component({
  selector: 'header[app-header]',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  host: {
    role: 'banner', // a11y: Landmark
    class: 'app-header',
  },
})
export class HeaderComponent {
  protected title = 'wiewarm.ch';
  protected darkMode = signal(false);

  toggleDarkMode() {
    this.darkMode.set(!this.darkMode());
    document.body.classList.toggle('dark-mode', this.darkMode());
  }
}
