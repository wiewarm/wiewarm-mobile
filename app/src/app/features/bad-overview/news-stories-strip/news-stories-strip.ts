import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import type { NewsStoryItem } from '../../../shared/services/interfaces/news-story.interface';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-news-stories-strip',
  templateUrl: './news-stories-strip.html',
  styleUrl: './news-stories-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class NewsStoriesStripComponent {
  readonly stories = input.required<NewsStoryItem[]>();
  readonly isReadFn = input.required<(id: string) => boolean>();
  readonly hasMore = input(false);
  readonly remainingCount = input(0);

  readonly openStory = output<number>();
  readonly loadMore = output<void>();

  isRead(id: string): boolean {
    return this.isReadFn()(id);
  }

  open(index: number) {
    this.openStory.emit(index);
  }

  requestMore() {
    this.loadMore.emit();
  }
}
