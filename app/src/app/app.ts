import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';
import { SpriteSheetComponent } from './shared/layout/icon/sprite-sheet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SpriteSheetComponent],
  templateUrl: './app.html',
  styleUrl: './styles.scss',
})
export class App {}
