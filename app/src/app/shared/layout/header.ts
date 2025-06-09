import { CdkMenuModule } from '@angular/cdk/menu';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CdkMenuModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class HeaderComponent {
  protected title = 'wiewarm';
}
