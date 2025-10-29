import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';
import { FooterComponent } from './shared/layout/footer/footer';
import { SpriteSheetComponent } from './shared/layout/icon/sprite-sheet';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, SpriteSheetComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './styles.scss',
})
export class App {}
