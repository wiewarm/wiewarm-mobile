import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { BadItem } from 'src/app/shared/interfaces/bad-item.interface';
import { Signal } from '@angular/core';

@Component({
  selector: 'app-sort-dialog',
  templateUrl: './sort-dialog.html',
  styleUrl: './sort-dialog.scss',
  imports: [],
})
export class SortDialogComponent {
  @ViewChild('dialog') private dialog?: ElementRef<HTMLDialogElement>;

  @Input({ required: true }) sortField!: Signal<keyof BadItem>;
  @Input({ required: true }) setSort!: (field: keyof BadItem) => void;

  open() {
    this.dialog?.nativeElement.showModal();
  }

  close() {
    this.dialog?.nativeElement.close();
  }
}
