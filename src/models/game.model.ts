export class GameModel {
  public players: string[] = ["Farmer", "Cow", "Doctor", "Death"];
  public stack: string[] = [];
  public playedCard: string[] = [];
  public currentPlayer: number = 0;

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
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }
}
