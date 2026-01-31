import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';
import { SpriteSheetComponent } from './shared/layout/icon/sprite-sheet';
import { FooterComponent } from './shared/layout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SpriteSheetComponent],
  templateUrl: './app.html',
  styleUrl: './styles.scss',
})
export class App {}
