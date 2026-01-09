import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

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

  isMobile = false;
  isDialogOpen = false;

  private readonly mobileWidth = 700;
  private readonly isBrowser: boolean;

  private readonly avatars: string[] = [
    'cow.png',
    'death.png',
    'doctor.png',
    'farmer.png',
    'man.png',
    'race.png',
  ];

  constructor(
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= this.mobileWidth;
    }
  }

  ngOnInit(): void {
    this.newGame();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    this.isMobile = window.innerWidth <= this.mobileWidth;
  }

  newGame(): void {
    this.game = new GameModel();
    this.currentCard = '';
    this.pickCardAnimation = false;
    this.game.currentPlayer = 0;
  }

  takeCard(): void {
    if (this.pickCardAnimation) return;
    if (this.game.players.length === 0) return;
    if (this.game.stack.length === 0) return;

    const card = this.game.stack.pop();
    if (!card) return;

    this.currentCard = card;
    this.pickCardAnimation = true;

    this.game.currentPlayer =
      (this.game.currentPlayer + 1) % this.game.players.length;

    setTimeout(() => {
      this.game.playedCard.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);
  }

  openAddPlayerDialog(): void {
    if (this.isDialogOpen) return;

    this.isDialogOpen = true;
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
      width: 'min(520px, calc(100vw - 24px))',
      maxWidth: '520px',
      maxHeight: 'calc(100vh - 24px)',
      autoFocus: false,
      panelClass: 'game-dialog',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      this.isDialogOpen = false; 

      const name = (result ?? '').trim();
      if (!name) return;

      const used = new Set(this.game.players.map((p) => p.avatar));
      const available = this.avatars.filter((a) => !used.has(a));
      const pool = available.length ? available : this.avatars;
      const avatar = pool[Math.floor(Math.random() * pool.length)];

      this.game.players.push({ name, avatar });

      if (this.game.players.length === 1) {
        this.game.currentPlayer = 0;
      }
    });
  }

  removePlayer(index: number): void {
    if (index < 0 || index >= this.game.players.length) return;

    this.game.players.splice(index, 1);

    if (this.game.players.length === 0) {
      this.game.currentPlayer = 0;
      return;
    }

    this.game.currentPlayer =
      this.game.currentPlayer % this.game.players.length;
  }
}
