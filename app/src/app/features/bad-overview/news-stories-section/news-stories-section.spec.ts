import { signal } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NewsStoryDialogStateService } from '../../../shared/services/news-story-dialog-state.service';
import type { NewsStoryItem } from '../../../shared/services/interfaces/news-story.interface';
import { StoryService } from '../../../shared/services/story.service';
import { NewsStoriesSectionComponent } from './news-stories-section';

class StoryServiceStub {
  readonly stories: NewsStoryItem[] = [
    {
      id: 'news:1:1',
      kind: 'news',
      badId: '1',
      badName: 'Bad A',
      locationText: '3000 Bern',
      title: 'Mitteilung',
      body: 'Text',
      imageUrl: null,
      thumbnailUrl: null,
      publishedAt: '2025-01-01 12:00:00',
      publishedAtPretty: '2025',
    },
    {
      id: 'news:1:2',
      kind: 'impression',
      badId: '1',
      badName: 'Bad A',
      locationText: '3000 Bern',
      title: 'Bild',
      body: '',
      imageUrl: '/img/a.jpg',
      thumbnailUrl: '/img/a-thumb.jpg',
      publishedAt: '2025-01-02 12:00:00',
      publishedAtPretty: '2025',
    },
  ];

  readonly newsStoriesResource = {
    hasValue: () => true,
    value: () => this.stories,
    isLoading: () => false,
    error: () => null,
  };
}

class NewsStoryDialogStateServiceStub {
  readonly dialogOpen = signal(false);
  readonly activeStoryIndex = signal(0);
  readonly activeStoryId = signal<string | null>(null);

  readonly syncStories = jasmine.createSpy('syncStories');
  readonly isRead = jasmine.createSpy('isRead').and.returnValue(false);
  readonly openStory = jasmine.createSpy('openStory');
  readonly closeStory = jasmine.createSpy('closeStory');
  readonly nextStory = jasmine.createSpy('nextStory');
  readonly prevStory = jasmine.createSpy('prevStory');
}

describe('NewsStoriesSectionComponent', () => {
  let fixture: ComponentFixture<NewsStoriesSectionComponent>;
  let component: NewsStoriesSectionComponent;
  let dialogState: NewsStoryDialogStateServiceStub;

  beforeEach(async () => {
    spyOn(window, 'matchMedia').and.returnValue({
      matches: false,
      media: '(max-width: 35.99em)',
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => true,
    } as MediaQueryList);

    await TestBed.configureTestingModule({
      imports: [NewsStoriesSectionComponent],
      providers: [
        { provide: StoryService, useClass: StoryServiceStub },
        {
          provide: NewsStoryDialogStateService,
          useClass: NewsStoryDialogStateServiceStub,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsStoriesSectionComponent);
    component = fixture.componentInstance;
    dialogState = TestBed.inject(
      NewsStoryDialogStateService,
    ) as unknown as NewsStoryDialogStateServiceStub;
    fixture.detectChanges();
  });

  it('keeps only one preview story per bath', () => {
    expect(component.storyPreviewPool().length).toBe(1);
    expect(dialogState.syncStories).toHaveBeenCalledWith(component.storyPreviewPool());
  });

  it('loads more stories only on small screens', () => {
    const initialCount = component.visibleStoryCount();

    component.loadMoreStories();
    expect(component.visibleStoryCount()).toBe(initialCount);

    component.isBelowSm.set(true);
    component.loadMoreStories();
    expect(component.visibleStoryCount()).toBe(initialCount + 3);
  });

  it('opens selected story via dialog state service', () => {
    component.openStory(0);
    expect(dialogState.openStory).toHaveBeenCalledWith(
      component.visibleNewsStories(),
      0,
    );
  });
});
