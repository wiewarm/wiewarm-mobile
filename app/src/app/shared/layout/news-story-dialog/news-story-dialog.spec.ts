import { TestBed } from '@angular/core/testing';
import type { ComponentFixture } from '@angular/core/testing';
import type { NewsStoryItem } from '../../services/interfaces/news-story.interface';
import { NewsStoryDialogComponent } from './news-story-dialog';

describe('NewsStoryDialogComponent', () => {
  let fixture: ComponentFixture<NewsStoryDialogComponent>;
  let component: NewsStoryDialogComponent;
  let dialog: HTMLDialogElement;

  const stories: NewsStoryItem[] = [
    {
      id: 'news:1:1',
      kind: 'news',
      badId: '1',
      badName: 'Bad A',
      locationText: '3000 Bern',
      title: 'Story A',
      body: 'Text A',
      imageUrl: null,
      thumbnailUrl: null,
      publishedAt: '2025-01-01 12:00:00',
      publishedAtPretty: '2025',
    },
    {
      id: 'news:1:2',
      kind: 'news',
      badId: '1',
      badName: 'Bad A',
      locationText: '3000 Bern',
      title: 'Story B',
      body: 'Text B',
      imageUrl: null,
      thumbnailUrl: null,
      publishedAt: '2025-01-01 12:10:00',
      publishedAtPretty: '2025',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsStoryDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsStoryDialogComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('stories', stories);
    fixture.componentRef.setInput('activeIndex', 0);
    fixture.componentRef.setInput('activeStoryId', stories[0].id);
    fixture.detectChanges();

    dialog = fixture.nativeElement as HTMLDialogElement;
    let isOpen = false;
    Object.defineProperty(dialog, 'open', {
      configurable: true,
      get: () => isOpen,
    });
    (dialog as HTMLDialogElement & { showModal: () => void }).showModal = () => {
      isOpen = true;
    };
    (dialog as HTMLDialogElement & { close: () => void }).close = () => {
      isOpen = false;
      dialog.dispatchEvent(new Event('close'));
    };

    component.open();
  });

  it('emits close on cancel event (Escape)', () => {
    let closed = false;
    component.closeDialog.subscribe(() => {
      closed = true;
    });

    dialog.dispatchEvent(new Event('cancel', { cancelable: true }));

    expect(closed).toBeTrue();
  });

  it('emits next on ArrowRight when next exists', () => {
    let next = false;
    component.nextStory.subscribe(() => {
      next = true;
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    expect(next).toBeTrue();
  });
});
