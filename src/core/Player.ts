import { Card } from "./Card";
import { SuitCollection } from "./deck/SuitCollection";

import { DirectionInstance, Direction, DirectionCollection } from "./Direction";
import { Hand } from "./Hand";
import { Trick } from "./Trick";

export enum PlayerPair {
  WEST_EAST = 0,
  NORTH_SOUTH = 1
}

export class Player {
  private direction: Direction;
  public hand: Card[];
  public played: Card[];
  public tricks: Trick[];

  constructor(d: Direction | DirectionInstance) {
    const i = typeof d === 'number' ? d : d.getValue();
    this.hand = [];
    this.played = [];
    this.tricks = [];
    this.direction = i;
  }
  
  public initWithExplicits(...valueSuits: string[][]): Player {
    for (let i = 0; i < valueSuits.length; i++) {
      const values: string[] = valueSuits[i];
      for (let j = 0; j < values.length; j++) {
        this.hand.push(Card.getFromValues(values[j], SuitCollection.list[i]));
      }
    }
    return this;
  }

  public initWithCards(cards: Card[]): Player {
    this.hand = cards.slice();
    return this;
  }

  public initWithCardsAndPlayed(cards: Card[], played: Card[]): Player {
    this.hand = cards.slice();
    this.played = played.slice();
    return this;
  }

  public initWithOther(other: Player): Player {
    this.hand = other.hand.slice();
    this.played = other.played.slice();
    return this;
  }

  private contains(list: Card[], c: Card): boolean {
    return list.indexOf(c) > -1;
  }

  public hasUnplayedCard(c: Card): boolean {
    return this.contains(this.hand, c);
  }

  public getUnplayedCardsCount(): number {
    return this.hand.length;
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public hasPlayedCard(c: Card): boolean {
    return this.contains(this.played, c);
  }

  public countTricksTaken(): number {
    return this.tricks.length;
  }

  public addTrickTaken(trick: Trick, trickNo?: number) {
    if (trickNo) trick.trickNo = trickNo;
    this.tricks.push(trick);
  }

  public getPossibleMoves(trick: Trick): Card[] {
    const d = trick.getDenomination();
    const matching: Card[] = this.hand.filter(c => c.denomination === d);
    let result: Card[];
    if (matching.length === 0) {
      result = new Hand(this.hand.slice()).getCardsHighToLow().reverse();
    } else {
      result = new Hand(matching).getCardsHighToLow().reverse();
    }
    return result;
  }

  public play(trick: Trick, moveIndex?: number): Card {
    const moves = this.getPossibleMoves(trick);
		if (moves.length === 0) {
      console.error(`${this.toString()} has no possible move for ${trick.toString()} (hand: ${this.hand.toString()})`);
    }
    if (moveIndex === undefined) moveIndex = moves.length - 1;
    const c = moves[moveIndex];
    this.played.push(c);
    this.hand.splice(this.hand.indexOf(c), 1);
    return c;
  }

  public playCard(c: Card) {
    this.played.push(c);
    this.hand.splice(this.hand.indexOf(c), 1);
    return c;
  }

  public pair(): PlayerPair {
    return Player.matchPair(this.direction);
  }

  public static matchPair(player: Direction): PlayerPair {
    let result: number;
    switch (player) {
      case Direction.WEST:
      case Direction.EAST:
        result = PlayerPair.WEST_EAST;
        break;
      case Direction.NORTH:
      case Direction.SOUTH:
        result = PlayerPair.NORTH_SOUTH;
        break;
      default:
        throw new Error("Unknown player: " + player);
    }
    return result;
  }

  public otherPair(): PlayerPair {
    return Player.matchPair((this.direction + 1) % 4);
  }

  public isPartnerWith(other: Player): boolean {
    return this.pair() == other.pair();
  }

  public toString(): string {
    return DirectionCollection.instance(this.direction).toString();
  }
}
