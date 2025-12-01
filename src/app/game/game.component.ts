import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Games } from '../../models/games';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule], // hier ist NgFor, NgIf, NgStyle usw. drin
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  pickCardAnimation = false;
  games: Games = new Games();
  newGame() {
    this.games = new Games();
  }

  takeCard() {
    this.pickCardAnimation = true;
  }
}
