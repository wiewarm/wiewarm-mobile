import { Injectable, signal } from '@angular/core';
import type { NewsStoryItem } from './interfaces/news-story.interface';

@Injectable({ providedIn: 'root' })
export class NewsStoryDialogStateService {
  private readonly readIds = signal<string[]>([]);

  readonly dialogOpen = signal(false);
  readonly activeStoryIndex = signal(0);
  readonly activeStoryId = signal<string | null>(null);

  isRead(id: string): boolean {
    return this.readIds().includes(id);
  }

  syncStories(stories: NewsStoryItem[]) {
    const validSet = new Set(stories.map((story) => story.id));
    this.readIds.update((ids) => ids.filter((id) => validSet.has(id)));

    // If the active story disappeared after a refresh/filter change, reset dialog state.
    const currentActiveId = this.activeStoryId();
    if (!currentActiveId) return;
    if (validSet.has(currentActiveId)) return;

    this.clearActiveStory();
  }

  openStory(stories: NewsStoryItem[], index: number) {
    if (!this.setActiveStory(stories, index)) return;
    this.dialogOpen.set(true);
  }

  closeStory() {
    this.dialogOpen.set(false);
  }

  nextStory(stories: NewsStoryItem[]) {
    this.setActiveStory(stories, this.activeStoryIndex() + 1);
  }

  prevStory(stories: NewsStoryItem[]) {
    this.setActiveStory(stories, this.activeStoryIndex() - 1);
  }

  private markRead(id: string) {
    this.readIds.update((ids) => {
      if (ids.includes(id)) return ids;
      return [...ids, id];
    });
  }

  private setActiveStory(stories: NewsStoryItem[], index: number): boolean {
    if (index < 0 || index >= stories.length) return false;

    // Keep both id and index in sync: id drives rendering, index drives next/prev.
    const story = stories[index];
    this.activeStoryIndex.set(index);
    this.activeStoryId.set(story.id);
    this.markRead(story.id);
    return true;
  }

  private clearActiveStory() {
    this.activeStoryId.set(null);
    this.activeStoryIndex.set(0);
    this.dialogOpen.set(false);
  }
}
