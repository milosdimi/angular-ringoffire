import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { MatCardModule } from '@angular/material/card';
import { GameModel } from '../../models/game.model';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  private router = inject(Router);
  private firestore = inject(Firestore);

  async newGame() {
    const game = new GameModel(); // ✅ Deck + Shuffle

    const docRef = await addDoc(collection(this.firestore, 'games'), {
      game: {
        players: game.players,
        stack: game.stack,           // ✅ NICHT leer
        playedCard: game.playedCard,
        currentPlayer: game.currentPlayer,
        currentCard: '',
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    this.router.navigateByUrl(`/game/${docRef.id}`);
  }
}
