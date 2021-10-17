import { Card } from "./Card";
import { Deal } from "./Deal";
import { Suit } from "./deck/Suit";
import { SuitCollection } from "./deck/SuitCollection";
import { Direction } from "./Direction";
import { Hand } from "./Hand";
import { Player } from "./Player";

export const PLAY_REFERENCE_GAME = false;

let pos = 0;
	
const a_multi = [
  0.12, 0.64, 0.23, 0.25, 0.33, 0.73, 0.91, 0.28, 0.9, 0.22
];

const b_multi = [
  0.41, 0.62, 0.81, 0.2
];

function nonrandom() {
  pos += 1;
  const x = a_multi[pos % a_multi.length] * b_multi[pos % b_multi.length] * 2;
  if (x > 1) return x - 1.0;
  return x;
}

export class GameUtils {

  public static initializeSingleColorSuits(g: Deal, cc?: number): void {
    const cardCount = cc === undefined ? 13 : cc;
    for (let i: number = Direction.WEST; i <= Direction.SOUTH; i++) {
      let spades: string[] = [];
      let hearts: string[] = [];
      let diamonds: string[] = [];
      let clubs: string[] = [];
      const currentHand: string[] = new Array<string>(cardCount);
      for (let j = 0; j < cardCount; j++) {
        currentHand[j] = Card.FullSuit[j];
      }
      switch (i) {
        case Direction.WEST:
          spades = currentHand;
          break;
        case Direction.NORTH:
          hearts = currentHand;
          break;
        case Direction.EAST:
          diamonds = currentHand;
          break;
        case Direction.SOUTH:
          clubs = currentHand;
          break;
      }
      g.getPlayer(i).initWithExplicits(spades, hearts, diamonds, clubs);
    }
  }

  public static initializeRandom(input: Player[] | Deal, cardCount?: number, overrideRandomizer?: () => number): void {
    const players: Player[] = (input as any).players || input;
    const deck: Card[] = GameUtils.buildDeck();
    if (cardCount === undefined) cardCount = 13;
    players.forEach((player: Player) => {
      const hand: Card[] = [];
      for (let j = 0; j < cardCount; j++) {
        hand.push(GameUtils.dealRandom(deck, overrideRandomizer)); // Card.getFromValues(Card.FullSuit[j], SuitCollection.list[i]));
      }
      player.initWithCards(new Hand(hand).getCardsHighToLow());
    });
  }
  
  private static dealRandom(ideck: Card[], overrideRandomizer?: () => number): Card {
    const randomizer = overrideRandomizer || (PLAY_REFERENCE_GAME ? nonrandom : Math.random);
    const index = Math.floor(randomizer() * ideck.length);
    const card: Card = ideck[index];
    ideck.splice(index, 1);
    return card;
  }

  public static buildDeck(): Card[] {
    const result: Card[] = [];
    Card.FullSuit.forEach((value: string) => {
      SuitCollection.list.forEach((denomination: Suit) => {
        result.push(Card.getFromValues(value, denomination));
      });
    });
    return result;
  }
}
