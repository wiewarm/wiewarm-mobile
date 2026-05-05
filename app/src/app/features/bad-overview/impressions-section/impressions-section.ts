import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { LoadingErrorComponent } from '../../../shared/layout/loading-error/loading-error';
import { StoryService } from '../../../shared/services/story.service';
import { BadResourceService } from '../../../shared/services/bad.service';
import { ImpressionItemComponent } from './impression-item/impression-item';

let nextHeadingId = 0;

@Component({
  selector: 'app-impressions-section',
  templateUrl: './impressions-section.html',
  styleUrl: './impressions-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoadingErrorComponent, ImpressionItemComponent],
  host: {
    class: 'app-impressions-section',
  },
})
export class ImpressionsSectionComponent {
  private readonly storyService = inject(StoryService);
  private readonly badService = inject(BadResourceService);

  readonly badId = input<number | null>(null);
  readonly heading = input('Bilder');

  readonly headingId = `impressions-heading-${nextHeadingId++}`;

  private readonly storiesResource = this.storyService.newsStoriesResource;

  readonly badSlugById = computed(() => {
    const map = new Map<number, string>();
    for (const bad of this.badService.badResource.value() ?? []) {
      map.set(bad.badid, bad.badid_text);
    }
    return map;
  });

  readonly impressionItems = computed(() => {
    const items = (this.storiesResource.value() ?? []).filter(
      (s) => s.kind === 'impression',
    );
    const badId = this.badId();
    return badId != null ? items.filter((item) => item.badId === badId) : items;
  });

  readonly impressionsState = computed<'idle' | 'loading' | 'error'>(() => {
    if (this.storiesResource.error()) return 'error';
    if (this.storiesResource.isLoading() && !this.impressionItems().length)
      return 'loading';
    return 'idle';
  });

  readonly shouldShowSection = computed(
    () =>
      this.storiesResource.isLoading() ||
      !!this.storiesResource.error() ||
      this.impressionItems().length > 0,
  );
}
