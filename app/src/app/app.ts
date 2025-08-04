import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrls: ['./styles.scss'],
})
export class App {}
