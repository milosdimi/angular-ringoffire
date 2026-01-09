import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

interface CardAction {
  card: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrls: ['./game-info.component.scss'],
})
export class GameInfoComponent {
  @Input() card: string = '';

  readonly cardAction: CardAction[] = [
    {
      card: 'Ace',
      title: 'Waterfall',
      description:
        'Everyone starts drinking at the same time. As soon as player 1 stops drinking, player 2 may stop, and so on.',
    },
    { card: '2', title: 'You', description: 'You decide who drinks.' },
    { card: '3', title: 'Me', description: 'Congrats! Drink a shot.' },
    {
      card: '4',
      title: 'Category',
      description:
        'Come up with a category (e.g. colors). Each player must name one item from the category.',
    },
    {
      card: '5',
      title: 'Bust a Jive',
      description:
        'Player 1 makes a dance move. Player 2 repeats it and adds a new one.',
    },
    { card: '6', title: 'Chicks', description: 'All girls drink.' },
    {
      card: '7',
      title: 'Heaven',
      description: 'Put your hands up! The last player drinks.',
    },
    {
      card: '8',
      title: 'Mate',
      description:
        'Pick a mate. Your mate must always drink when you drink and vice versa.',
    },
    {
      card: '9',
      title: 'Thumbmaster',
      description:
        'You are the Thumbmaster. At any time, put your thumb on the table. The last person to do so drinks.',
    },
    { card: '10', title: 'Men', description: 'All men drink.' },
    {
      card: 'Jack',
      title: 'Quizmaster',
      description: 'Anyone who answers your questions must drink.',
    },
    {
      card: 'Queen',
      title: 'Never Have I Ever',
      description:
        'Say something you have never done. Everyone who has done it must drink.',
    },
    {
      card: 'King',
      title: 'Rule',
      description: 'Make a rule. Anyone who breaks the rule must drink.',
    },
  ];

  get currentAction(): CardAction | undefined {
    if (!this.card) return undefined;

    const normalized = this.normalizeCard(this.card);
    return this.cardAction.find((a) => a.card === normalized);
  }

  private normalizeCard(card: string): string {
  
    const parts = card.split('_');
    const raw = parts[1]; // "12"

    const n = Number(raw);
    if (!Number.isFinite(n)) return card;

    // 1 = Ace, 11 = Jack, 12 = Queen, 13 = King, sonst Zahl 2-10
    if (n === 1) return 'Ace';
    if (n === 11) return 'Jack';
    if (n === 12) return 'Queen';
    if (n === 13) return 'King';

    return String(n); // "2".."10"
  }

  get isRedCard(): boolean {
    if (!this.card) return false;
    return this.card.includes('hearts') || this.card.includes('diamonds');
  }
}
