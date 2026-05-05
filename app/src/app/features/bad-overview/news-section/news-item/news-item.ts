import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import type { NewsStoryItem } from '../../../../shared/services/interfaces/news-story.interface';

@Component({
  selector: 'article[app-news-item]',
  templateUrl: './news-item.html',
  styleUrl: './news-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsItemComponent {
  readonly item = input.required<NewsStoryItem>();
  /** True when the currently logged-in user owns this news entry. */
  readonly canDelete = input(false);
  readonly deleted = output<number>();

  confirmDelete() {
    const infoId = this.item().infoId;
    if (infoId == null) return;
    if (confirm('Mitteilung löschen?')) {
      this.deleted.emit(infoId);
    }
  }
}
