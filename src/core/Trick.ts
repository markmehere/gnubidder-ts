import { Card } from "./Card";
import { Suit } from "./deck/Suit";
import { Trump } from "./deck/Trump";
import { Direction } from "./Direction";
import { Player } from "./Player";


export class Trick {
  private cards: Card[];
  private trump: Trump;
  public players: Player[];
  public trickNo: number;

  constructor(trump: Trump) {
    this.cards = [];
    this.players = [];
    this.trump = trump;
    this.trickNo = -1;
  }

  public duplicate(): Trick {
    const result: Trick = new Trick(this.getTrump());
    result.cards = this.cards.slice();
    result.players = this.players.slice();
    return result;
  }

  public addCard(card: Card, p: Player) {
    if (!p) throw new Error('No player');
    this.cards.push(card);
    this.players.push(p);
  }

  public isStart(): boolean {
    return this.cards.length === 0;
  }

  public isDone(): boolean {
    return this.cards.length === 4;
  }

  public getHighestCard(): Card {
    const overall = this.cards.reduce((highest: Card, card: Card) => {
      if (highest == null) {
        return card;
      } else if (card.trumps(highest, this.trump)) {
        return card;
      } else if (card.hasSameColorAs(highest) && card.hasGreaterValueThan(highest)) {
        return card;
      }
      return highest;
    }, null);

    return overall;
  }

  public setTrump(trump: Trump) {
    this.trump = trump;
  }

  public getDenomination(): Suit {
    if (this.cards.length > 0) {
      return this.cards[0].denomination;
    } else {
      return null;
    }
  }

  public getTrump(): Trump {
    return this.trump;
  }

  public toString(): string {
    return `[${this.cards.map(c => c.toString()).join(', ')}]`;
  }

  public getCards(): Card[] {
    return this.cards.slice();
  }

  public getCardsPlayed(): number {
    return this.cards.length;
  }

  public cardPlayedBy(d: Direction): Card {
    const index = this.players.findIndex(p => p.getDirection() === d);
    return (index > -1) ? this.cards[index] : null;
  }

  public whoPlayed(card: Card): Player {
    return this.players[this.cards.indexOf(card)];
  }
}
