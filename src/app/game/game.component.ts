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
  game: GameModel = new GameModel();

  ngOnInit(): void {
    this.newGame();
  }
  newGame() {
    this.game = new GameModel();
    console.log(this.game);
  }

  takeCard() {
    this.pickCardAnimation = true;
  }
}
