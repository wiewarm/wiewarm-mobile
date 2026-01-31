import { Component } from '@angular/core';

@Component({
  selector: 'footer[app-footer]',
  template: `
    <div class="footer-content">
      <span class="meta copyright"
        >&copy; wiewarm.ch 2001-{{ currentYear }}</span
      >
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
  host: {
    role: 'contentinfo',
    class: 'app-footer',
  },
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}
