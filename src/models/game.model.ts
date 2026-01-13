export interface Player {
  name: string;
  avatar: string;
}
export class GameModel {
  public players: Player[] = [];
  public stack: string[] = [];
  public playedCard: string[] = [];
  public currentPlayer: number = 0;
  public pickCardAnimation = false;
  public currentCard = '';

  constructor() {
    this.generateDeck();
    this.shuffle(this.stack);
  }

  private generateDeck() {
    for (let i = 1; i <= 13; i++) {
      this.stack.push('ace_' + i);
      this.stack.push('clubs_' + i);
      this.stack.push('diamonds_' + i);
      this.stack.push('hearts_' + i);
    }
  }

  private shuffle(array: string[]) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      const randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }
}
