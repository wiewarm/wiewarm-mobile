import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../services/storage/theme.service';
import { IconComponent } from '../icon/icon';

@Component({
  selector: 'footer[app-footer]',
  template: `
    <div class="footer-content">
      <span class="meta copyright"
        >&copy; wiewarm.ch 2001-{{ currentYear }}</span
      >
      <button
        type="button"
        class="theme-toggle"
        role="switch"
        [class.is-light]="!theme.darkMode()"
        [class.is-dark]="theme.darkMode()"
        [attr.aria-label]="
          theme.darkMode() ? 'Auf Hell umschalten' : 'Auf Dunkel umschalten'
        "
        [attr.aria-checked]="theme.darkMode()"
        (click)="theme.toggle()"
      >
        <span class="theme-track">
          <span class="theme-thumb" aria-hidden="true"></span>
          <span class="theme-label theme-label-light"
            ><app-icon [symbolId]="'#light_mode'"
          /></span>
          <span class="theme-label theme-label-dark"
            ><app-icon [symbolId]="'#dark_mode'"
          /></span>
        </span>
      </button>
      <span class="meta license">
        <img
          [attr.src]="'assets/img/by-sa.png'"
          alt="Creative Commons BY-SA"
          width="80"
          loading="lazy"
        />
      </span>
    </div>
  `,
  styleUrls: ['./footer.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  host: {
    role: 'contentinfo',
    class: 'app-footer',
  },
})
export class FooterComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly currentYear = new Date().getFullYear();
}
