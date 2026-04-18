import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { LoadingErrorComponent } from '../../../shared/layout/loading-error/loading-error';
import { IconComponent } from '../../../shared/layout/icon/icon';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { StoryService } from '../../../shared/services/story.service';
import { ErrorReporter } from '../../../shared/util/edit-error.util';
import { NewsItemComponent } from './news-item/news-item';
import { NewsEditorComponent } from './news-editor/news-editor';

let nextHeadingId = 0;

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.html',
  styleUrl: './news-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LoadingErrorComponent,
    IconComponent,
    NewsItemComponent,
    NewsEditorComponent,
  ],
  host: {
    class: 'app-news-section',
  },
})
export class NewsSectionComponent {
  private readonly storyService = inject(StoryService);
  private readonly error = inject(ErrorReporter);
  readonly auth = inject(AuthService);

  readonly badId = input<number | null>(null);
  readonly heading = input('News');

  readonly headingId = `news-heading-${nextHeadingId++}`;
  readonly showNewsEditor = signal(false);

  private readonly newsResource = this.storyService.newsStoriesResource;

  readonly newsItems = computed(() => {
    const items = this.storyService.getNewsItems();
    const badId = this.badId();
    return badId != null ? items.filter((item) => item.badId === badId) : items;
  });

  readonly canCreate = computed(() => this.auth.canEditNewsFor(this.badId()));

  readonly newsState = computed<'idle' | 'loading' | 'error'>(() => {
    if (this.newsResource.error()) {
      return 'error';
    }

    if (this.newsResource.isLoading() && !this.newsItems().length) {
      return 'loading';
    }

    return 'idle';
  });

  readonly shouldShowSection = computed(
    () =>
      this.newsResource.isLoading() ||
      !!this.newsResource.error() ||
      this.newsItems().length > 0 ||
      this.canCreate(),
  );

  /**
   * Uses `ErrorReporter` directly instead of going through `EditBase.save`:
   * this is a container component, not a form — no loading/error/success
   * signals, no inline feedback. A failed delete just surfaces a toast.
   */
  async deleteNews(infoId: number) {
    try {
      await this.storyService.deleteNews(infoId);
    } catch (e) {
      this.error.report(e, 'Löschen fehlgeschlagen. Bitte erneut versuchen.');
    }
  }
}
