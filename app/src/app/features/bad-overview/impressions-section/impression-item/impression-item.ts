import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import type { NewsStoryItem } from '../../../../shared/services/interfaces/news-story.interface';

@Component({
  selector: 'article[app-impression-item]',
  templateUrl: './impression-item.html',
  styleUrl: './impression-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule],
})
export class ImpressionItemComponent {
  readonly item = input.required<NewsStoryItem>();
  readonly badSlug = input<string | null>(null);
}
