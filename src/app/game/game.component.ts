import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { GameModel, Player } from '../../models/game.model';
import { PlayerComponent } from '../player/player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { DialogEditPlayerComponent } from '../dialog-edit-player/dialog-edit-player.component';

type EditPlayerResult = { name: string; avatar: string } | undefined;

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
export class GameComponent implements OnInit, OnDestroy {
  // UI-only animation (local), NOT stored in Firestore
  pickCardAnimation = false;

  game: GameModel = new GameModel();

  // UI
  isMobile = false;
  isDialogOpen = false;

  private readonly mobileWidth = 700;
  private readonly isBrowser: boolean;
  private readonly PICK_MS = 900;

  // Firestore
  private gameId = '';
  private gameSub?: Subscription;

  // move event tracking (synced animation trigger)
  private lastSeenMoveId = 0;

  // Avatar Pool (assets/img/profile/)
  private readonly avatars: string[] = [
    'cow.png',
    'death.png',
    'doctor.png',
    'farmer.png',
    'man.png',
    'race.png',
  ];

  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private firestore: Firestore,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.isMobile = window.innerWidth <= this.mobileWidth;
    }
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) return;

      this.gameId = id;
      this.gameSub?.unsubscribe();

      // keep CSS & TS animation duration in sync
      if (this.isBrowser) {
        document.documentElement.style.setProperty(
          '--pick-ms',
          `${this.PICK_MS}ms`
        );
      }

      this.listenToGameFromFirestore();
    });
  }

  ngOnDestroy(): void {
    this.gameSub?.unsubscribe();
  }

  /* =====================
     Responsive (SSR-safe)
     ===================== */
  @HostListener('window:resize')
  onResize(): void {
    if (!this.isBrowser) return;
    this.isMobile = window.innerWidth <= this.mobileWidth;
  }

  /* =====================
     Firestore: Listen + Save
     ===================== */
  private listenToGameFromFirestore(): void {
    const ref = doc(this.firestore, `games/${this.gameId}`);

    this.gameSub = docData(ref).subscribe((data: any) => {
      const g = data?.game;
      if (!g) return;

      this.game.players = Array.isArray(g.players) ? g.players : [];
      this.game.stack = Array.isArray(g.stack) ? g.stack : [];
      this.game.playedCard = Array.isArray(g.playedCard) ? g.playedCard : [];
      this.game.currentPlayer =
        typeof g.currentPlayer === 'number' ? g.currentPlayer : 0;

      this.game.currentCard =
        typeof g.currentCard === 'string' ? g.currentCard : '';

      this.game.moveId = typeof g.moveId === 'number' ? g.moveId : 0;
      this.game.lastMoveAt =
        typeof g.lastMoveAt === 'number' ? g.lastMoveAt : 0;

      // Old docs safety: if deck missing, create one
      if (this.game.stack.length === 0) {
        const fresh = new GameModel();
        this.game.stack = fresh.stack;
        this.game.playedCard = [];
        this.game.currentPlayer = 0;
        this.game.currentCard = '';
        this.game.moveId = 0;
        this.game.lastMoveAt = 0;
        this.saveGameToFirestore().catch(console.error);
        return;
      }

      // Start animation on all clients for a NEW move event
      if (this.game.moveId && this.game.moveId !== this.lastSeenMoveId) {
        this.lastSeenMoveId = this.game.moveId;
        this.playPickAnimation(this.game.lastMoveAt);
      }
    });
  }

  private async saveGameToFirestore(): Promise<void> {
    if (!this.gameId) return;
    const ref = doc(this.firestore, `games/${this.gameId}`);

    const payload = {
      game: {
        players: this.game.players,
        stack: this.game.stack,
        playedCard: this.game.playedCard,
        currentPlayer: this.game.currentPlayer,

        currentCard: this.game.currentCard,

        moveId: this.game.moveId ?? 0,
        lastMoveAt: this.game.lastMoveAt ?? 0,
      },
      updatedAt: Date.now(),
    };

    await setDoc(ref, payload, { merge: true });
  }

  /* =====================
     Animation (local UI only)
     ===================== */
  private playPickAnimation(lastMoveAt: number): void {
    const lag = Date.now() - (lastMoveAt || Date.now());
    const delay = Math.max(0, 80 - lag);

    this.pickCardAnimation = false;

    setTimeout(() => {
      this.pickCardAnimation = true;
      setTimeout(() => (this.pickCardAnimation = false), this.PICK_MS);
    }, delay);
  }

  /* =====================
     Game Logic
     ===================== */
  takeCard(): void {
    if (this.pickCardAnimation) return;
    if (this.game.players.length === 0) return;
    if (this.game.stack.length === 0) return;

    const card = this.game.stack.pop();
    if (!card) return;

    // next player
    this.game.currentPlayer =
      (this.game.currentPlayer + 1) % this.game.players.length;

    // shared move event
    this.game.currentCard = card;
    this.game.moveId = (this.game.moveId ?? 0) + 1;
    this.game.lastMoveAt = Date.now();

    // save immediately so other clients can animate
    this.saveGameToFirestore().catch(console.error);

    // local animation immediately
    this.playPickAnimation(this.game.lastMoveAt);

    // after animation ends -> put card on discard pile and save
    setTimeout(() => {
      const last = this.game.playedCard[this.game.playedCard.length - 1];
      if (last !== this.game.currentCard) {
        this.game.playedCard.push(this.game.currentCard);
        this.saveGameToFirestore().catch(console.error);
      }
    }, this.PICK_MS);
  }

  /* =====================
     Player Handling
     ===================== */
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

      const newPlayer: Player = { name, avatar };
      this.game.players.push(newPlayer);

      if (this.game.players.length === 1) {
        this.game.currentPlayer = 0;
      }

      this.saveGameToFirestore().catch(console.error);
    });
  }

  openEditPlayerDialog(index: number): void {
    const player = this.game.players[index];

    const dialogRef = this.dialog.open(DialogEditPlayerComponent, {
      width: 'min(520px, calc(100vw - 24px))',
      maxWidth: '520px',
      data: {
        name: player.name,
        avatar: player.avatar,
      },
      panelClass: 'game-dialog',
    });

    dialogRef.afterClosed().subscribe(async (result: EditPlayerResult) => {
      if (!result) return;

      const name = (result.name ?? '').trim();
      const avatar = result.avatar;

      if (!name) return;

      // update local state
      this.game.players[index] = { name, avatar };

      // persist
      try {
        await this.saveGameToFirestore();
      } catch (e) {
        console.error('Failed to save edited player', e);
      }
    });
  }

  async removePlayer(index: number): Promise<void> {
    if (index < 0 || index >= this.game.players.length) return;

    this.game.players.splice(index, 1);

    if (this.game.players.length === 0) {
      this.game.currentPlayer = 0;
    } else {
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
    }

    try {
      await this.saveGameToFirestore();
    } catch (e) {
      console.error('saveGameToFirestore failed', e);
    }
  }
}
