import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  constructor(private router: Router) {}

  isStarting = false;

  newGame() {
    if (this.isStarting) return;
    this.isStarting = true;

    this.router.navigateByUrl('/game');
  }
}
