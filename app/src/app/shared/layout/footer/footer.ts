import { Component } from '@angular/core';

@Component({
  selector: 'footer[app-footer]',
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  host: {
    role: 'contentinfo',
    class: 'app-footer',
  },
})
export class FooterComponent {
  protected readonly currentYear = new Date().getFullYear();
}


