import { Component, ViewChild, ElementRef, input, output } from '@angular/core';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  standalone: true,
  imports: [],
})
export class SortDialogComponent {
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDialogElement>;

  readonly sortField = input.required<keyof BadItem>();
  readonly sortDirection = input.required<'asc' | 'desc'>();

  readonly setSort = output<{
    field: keyof BadItem;
    direction: 'asc' | 'desc';
  }>();

  open() {
    this.dialog?.nativeElement.showModal();
  }

  close() {
    this.dialog?.nativeElement.close();
  }

  applySort(field: keyof BadItem, direction: 'asc' | 'desc') {
    this.setSort.emit({ field, direction });
    this.close();
  }
}
