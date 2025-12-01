import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameModel } from '../../models/game.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule], // hier ist NgFor, NgIf, NgStyle usw. drin
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game: GameModel = new GameModel();

  ngOnInit(): void {
    this.newGame();
  }
  newGame() {
    this.game = new GameModel();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() || '';
      console.log(this.currentCard);
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.pickCardAnimation = false;
      }, 1500);
    }
  }
}
