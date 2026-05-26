import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { IconComponent } from 'src/app/shared/layout/icon/icon';

@Component({
  selector: 'app-bad-search',
  imports: [IconComponent],
  templateUrl: './bad-search.html',
  styleUrl: './bad-search.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadSearchComponent {
  readonly value = model('');
}
