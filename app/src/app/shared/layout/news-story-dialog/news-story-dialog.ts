import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
} from '@angular/core';
import type { NewsStoryItem } from '../../services/interfaces/news-story.interface';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'dialog[app-news-story-dialog]',
  templateUrl: './news-story-dialog.html',
  styleUrl: './news-story-dialog.scss',
  imports: [NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'dialog',
    'aria-modal': 'true',
    'aria-labelledby': 'news-dialog-title',
    tabindex: '-1',
    class: 'news-dialog',
    '(cancel)': 'onDialogCancel($event)',
    '(click)': 'onDialogClick($event)',
    '(close)': 'onNativeClose()',
  },
})
export class NewsStoryDialogComponent {
  private readonly elRef = inject(ElementRef<HTMLDialogElement>);
  readonly stories = input.required<NewsStoryItem[]>();
  readonly activeIndex = input.required<number>();
  readonly activeStoryId = input<string | null>(null);

  readonly closeDialog = output<void>();
  readonly nextStory = output<void>();
  readonly prevStory = output<void>();

  // Resolve by id to avoid stale content when the visible story list is re-ordered.
  readonly activeStory = computed(() => {
    const stories = this.stories();
    if (!stories.length) return null;

    const selectedStoryId = this.activeStoryId();
    if (!selectedStoryId) return null;

    return stories.find((entry) => entry.id === selectedStoryId) ?? null;
  });

  readonly hasPrev = computed(() => this.activeIndex() > 0);
  readonly hasNext = computed(
    () => this.activeIndex() < this.stories().length - 1,
  );

  open() {
    if (!this.elRef.nativeElement.open) {
      this.elRef.nativeElement.showModal();
    }
  }

  close() {
    if (this.elRef.nativeElement.open) {
      this.elRef.nativeElement.close();
    }
  }

  @HostListener('document:keydown.arrowright')
  onArrowRight() {
    if (this.elRef.nativeElement.open && this.hasNext()) {
      this.nextStory.emit();
    }
  }

  @HostListener('document:keydown.arrowleft')
  onArrowLeft() {
    if (this.elRef.nativeElement.open && this.hasPrev()) {
      this.prevStory.emit();
    }
  }

  next() {
    if (!this.hasNext()) return;
    this.nextStory.emit();
  }

  prev() {
    if (!this.hasPrev()) return;
    this.prevStory.emit();
  }

  onDialogCancel(event: Event) {
    event.preventDefault();
    this.close();
  }

  onNativeClose() {
    // Native close events (Esc/backdrop/button) must propagate back to app state.
    this.closeDialog.emit();
  }

  onDialogClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}
