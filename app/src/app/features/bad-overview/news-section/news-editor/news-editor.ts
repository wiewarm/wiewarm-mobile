import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditBase } from '../../../../shared/edit.base';
import { CloseButtonComponent } from '../../../../shared/layout/close-button/close-button';
import { EditFeedbackComponent } from '../../../../shared/layout/edit-feedback/edit-feedback';
import { StoryService } from '../../../../shared/services/story.service';

@Component({
  selector: 'dialog[app-news-editor]',
  templateUrl: './news-editor.html',
  styleUrl: './news-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CloseButtonComponent, FormsModule, EditFeedbackComponent],
  host: {
    'aria-modal': 'true',
    'aria-labelledby': 'news-editor-title',
  },
})
export class NewsEditorComponent extends EditBase implements AfterViewInit {
  private readonly elementRef = inject(ElementRef<HTMLDialogElement>);
  private readonly storyService = inject(StoryService);

  readonly badId = input<number | undefined>();
  readonly closed = output<void>();
  readonly text = signal('');

  private readonly editorRef =
    viewChild<ElementRef<HTMLTextAreaElement>>('editor');

  ngAfterViewInit() {
    this.elementRef.nativeElement.showModal();
    this.editorRef()?.nativeElement.focus();
  }

  close() {
    this.elementRef.nativeElement.close();
    this.closed.emit();
  }

  async submit() {
    const text = this.text().trim();
    if (!text) {
      this.error.set('Bitte Text eingeben.');
      return;
    }

    await this.save(async () => {
      await this.storyService.postNews(this.toHtml(text));
      this.text.set('');
      this.close();
    });
  }

  private toHtml(text: string): string {
    return text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
      .replace(/\r\n|\r|\n/g, '<br>');
  }
}
