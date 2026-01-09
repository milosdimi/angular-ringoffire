import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { GameModel, Player } from '../../models/game.model';
import { PlayerComponent } from '../player/player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    GameInfoComponent,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard = '';
  game: GameModel = new GameModel();

  // Avatar Pool (deine Dateien in assets/img/profile/)
  private readonly avatars: string[] = [
    'cow.png',
    'death.png',
    'doctor.png',
    'farmer.png',
    'man.png',
    'race.png',
  ];

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.newGame();
  }

  newGame(): void {
    this.game = new GameModel();
    this.currentCard = '';
    this.pickCardAnimation = false;

    // optional: Start bei erstem Spieler
    this.game.currentPlayer = 0;
  }

  takeCard(): void {
    // keine Doppel-Animation / keine Karte ziehen ohne Spieler / keine Karten mehr im Stack
    if (this.pickCardAnimation) return;
    if (this.game.players.length === 0) return;
    if (this.game.stack.length === 0) return;

    const card = this.game.stack.pop();
    if (!card) return;

    this.currentCard = card;
    this.pickCardAnimation = true;

    // nächster Spieler (safe)
    this.game.currentPlayer =
      (this.game.currentPlayer + 1) % this.game.players.length;

    setTimeout(() => {
      this.game.playedCard.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openAddPlayerDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      const name = (result ?? '').trim();
      if (!name) return;

      // Avatar auswählen: möglichst einzigartig, bis alle verbraucht
      const used = new Set(this.game.players.map((p) => p.avatar));
      const available = this.avatars.filter((a) => !used.has(a));

      const pool = available.length ? available : this.avatars;
      const avatar = pool[Math.floor(Math.random() * pool.length)];

      const newPlayer: Player = { name, avatar };
      this.game.players.push(newPlayer);

      // wenn erster Spieler hinzugefügt wird: currentPlayer sauber setzen
      if (this.game.players.length === 1) {
        this.game.currentPlayer = 0;
      }
    });
  }

  // Optional: falls du später einen Player löschen willst
  removePlayer(index: number): void {
    if (index < 0 || index >= this.game.players.length) return;

    this.game.players.splice(index, 1);

    if (this.game.players.length === 0) {
      this.game.currentPlayer = 0;
      return;
    }

    // currentPlayer im gültigen Bereich halten
    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
  }
}
