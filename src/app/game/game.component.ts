import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameModel } from '../../models/game.model';
import { PlayerComponent } from "../player/player.component";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatIconModule, MatButtonModule], // hier ist NgFor, NgIf, NgStyle usw. drin
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

      this.pickCardAnimation = true;

      console.log('wen card: ' + this.currentCard);
      console.log('game ist ', +this.game);

      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }
}
