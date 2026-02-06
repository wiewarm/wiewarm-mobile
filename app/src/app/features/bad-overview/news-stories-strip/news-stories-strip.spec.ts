import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import { NewsStoriesStripComponent } from './news-stories-strip';
import type { NewsStoryItem } from '../../../shared/services/interfaces/news-story.interface';

describe('NewsStoriesStripComponent', () => {
  let fixture: ComponentFixture<NewsStoriesStripComponent>;
  let component: NewsStoriesStripComponent;

  const stories: NewsStoryItem[] = [
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
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsStoriesStripComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsStoriesStripComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stories', stories);
    fixture.componentRef.setInput('isReadFn', () => true);
    fixture.detectChanges();
  });

  it('renders read state class based on callback', () => {
    const button = fixture.nativeElement.querySelector('.story-button') as HTMLButtonElement;
    expect(button.classList.contains('is-read')).toBeTrue();
  });

  it('emits index on click', () => {
    let emittedIndex = -1;
    component.openStory.subscribe((index) => {
      emittedIndex = index;
    });

    const button = fixture.nativeElement.querySelector('.story-button') as HTMLButtonElement;
    button.click();

    expect(emittedIndex).toBe(0);
  });

  it('emits loadMore when more button is clicked', () => {
    let emitted = false;
    component.loadMore.subscribe(() => {
      emitted = true;
    });

    fixture.componentRef.setInput('hasMore', true);
    fixture.componentRef.setInput('remainingCount', 5);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.story-button-more') as HTMLButtonElement;
    button.click();

    expect(emitted).toBeTrue();
  });
});
