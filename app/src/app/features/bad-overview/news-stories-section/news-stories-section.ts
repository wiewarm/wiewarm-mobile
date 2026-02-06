import type { ResourceRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LoadingErrorComponent } from '../../../shared/layout/loading-error/loading-error.component';
import { NewsStoryDialogComponent } from '../../../shared/layout/news-story-dialog/news-story-dialog';
import type { NewsStoryItem } from '../../../shared/services/interfaces/news-story.interface';
import { NewsStoryDialogStateService } from '../../../shared/services/news-story-dialog-state.service';
import { StoryService } from '../../../shared/services/story.service';
import { NewsStoriesStripComponent } from '../news-stories-strip/news-stories-strip';

@Component({
  selector: 'app-news-stories-section',
  templateUrl: './news-stories-section.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NewsStoriesStripComponent,
    LoadingErrorComponent,
    NewsStoryDialogComponent,
  ],
})
export class NewsStoriesSectionComponent {
  private readonly storyPageSize = 3;
  private readonly smMaxMediaQuery = '(max-width: 35.99em)';
  private readonly destroyRef = inject(DestroyRef);
  private readonly storyService = inject(StoryService);
  private readonly smMediaQueryList = window.matchMedia(this.smMaxMediaQuery);
  private smBreakpointListener?: (event: MediaQueryListEvent) => void;

  readonly newsStoryDialogState = inject(NewsStoryDialogStateService);
  readonly newsStoryDialogRef = viewChild(NewsStoryDialogComponent);
  readonly newsStoriesResource: ResourceRef<NewsStoryItem[] | undefined> =
    this.storyService.newsStoriesResource;
  readonly isBelowSm = signal(this.smMediaQueryList.matches);
  readonly visibleStoryCount = signal(this.storyPageSize);
  readonly isStoryReadFn = (id: string) => this.newsStoryDialogState.isRead(id);

  constructor() {
    this.smBreakpointListener = (event: MediaQueryListEvent) => {
      this.isBelowSm.set(event.matches);
    };
    this.smMediaQueryList.addEventListener('change', this.smBreakpointListener);

    this.destroyRef.onDestroy(() => {
      if (this.smBreakpointListener) {
        this.smMediaQueryList.removeEventListener(
          'change',
          this.smBreakpointListener,
        );
      }
    });
  }

  readonly newsStories = computed(() => {
    if (!this.newsStoriesResource.hasValue()) return [];
    return this.newsStoriesResource.value();
  });

  // Keep one preview story per bath to avoid duplicate rings in the strip.
  readonly storyPreviewPool = computed(() => {
    const seenBadIds = new Set<string>();
    const uniqueStories: NewsStoryItem[] = [];

    for (const story of this.newsStories()) {
      if (seenBadIds.has(story.badId)) continue;
      seenBadIds.add(story.badId);
      uniqueStories.push(story);
    }

    return uniqueStories;
  });

  readonly visibleNewsStories = computed(() => {
    const stories = this.storyPreviewPool();
    if (!this.isBelowSm()) return stories;
    return stories.slice(0, this.visibleStoryCount());
  });

  readonly hasMoreStories = computed(
    () =>
      this.isBelowSm() &&
      this.visibleStoryCount() < this.storyPreviewPool().length,
  );

  readonly remainingStoryCount = computed(() => {
    if (!this.isBelowSm()) return 0;
    return Math.max(
      this.storyPreviewPool().length - this.visibleStoryCount(),
      0,
    );
  });

  readonly syncReadIdsEffect = effect(() => {
    this.newsStoryDialogState.syncStories(this.storyPreviewPool());
  });

  // Bridge signal state to the native <dialog> lifecycle.
  readonly syncNewsDialogEffect = effect(() => {
    const shouldOpen = this.newsStoryDialogState.dialogOpen();
    if (shouldOpen) {
      this.newsStoryDialogRef()?.open();
      return;
    }

    this.newsStoryDialogRef()?.close();
  });

  loadMoreStories() {
    if (!this.isBelowSm()) return;
    this.visibleStoryCount.update((count) => count + this.storyPageSize);
  }

  openStory(index: number) {
    this.newsStoryDialogState.openStory(this.visibleNewsStories(), index);
  }

  nextStory() {
    this.newsStoryDialogState.nextStory(this.visibleNewsStories());
  }

  prevStory() {
    this.newsStoryDialogState.prevStory(this.visibleNewsStories());
  }
}
