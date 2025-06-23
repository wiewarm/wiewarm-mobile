import { Component, ViewChild, ElementRef, input, output } from '@angular/core';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.scss',
  standalone: true,
  imports: [],
})
export class FilterDialogComponent {
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDialogElement>;

  readonly filterOption = input.required<'aktuell' | 'all'>();
  readonly setFilter = output<'aktuell' | 'all'>();

  open() {
    this.dialog?.nativeElement.showModal();
  }

  close() {
    this.dialog?.nativeElement.close();
  }

  applyFilter(option: 'aktuell' | 'all') {
    this.setFilter.emit(option);
    this.close();
  }
}
