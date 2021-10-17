import { Card } from "../Card";
import { Suit } from "../deck/Suit";
import { SuitCollection } from "../deck/SuitCollection";
import { Hand } from "../Hand";


export class TrickCalculator {
  public hand: Hand;

  constructor(hand: Hand) {
    this.hand = hand;
  }

  public playingTricks(): number {
    let trickCount = 0;
    SuitCollection.list.forEach((color: Suit) => {
      trickCount += this.doublePlayingTricks(color);
    });
    return trickCount / 2;
  }

  public doublePlayingTricks(color: Suit): number {
    let tricks = 0;
    const cards: Card[] = this.hand.getSuitHi2Low(color);
    const length: number = cards.length;
    if (length >= 1) {
      if (cards[0].value == Card.ACE)
        tricks += 2;
      if (length >= 2) {
        if (tricks == 2) {
          if (cards[1].value == Card.KING)
            tricks += 2;
          else if (cards[1].value == Card.QUEEN)
            tricks++;
          if (length >= 3) {
            if (tricks == 4) {
              if (cards[2].value == Card.QUEEN)
                tricks += 2;
              else if (cards[2].value == Card.JACK)
                tricks++;
            } else if (tricks == 3) {
              if (cards[2].value == Card.JACK)
                tricks += 2;
              else if (cards[2].value == Card.TEN)
                tricks++;
            } else if (cards[1].value == Card.JACK) {
              tricks += 1;
            }
          }
        } else if (cards[0].value == Card.KING) {
          if (cards[1].value == Card.QUEEN || cards[1].value == Card.JACK) {
            if (length >= 3) {
              if (cards[1].value == Card.QUEEN)
                tricks += 3;
              else if (cards[2].value == Card.TEN)
                tricks += 3;
            } else if (cards[1].value == Card.TEN) {
              tricks += 2;
            }
          }
        } else if (cards[0].value == Card.QUEEN) {
          if (length >= 3) {
            if (cards[1].value == Card.JACK)
              tricks += 2;
            else
              tricks++;
          }
        } else if (cards[0].value == Card.JACK && cards[1].value == Card.TEN) {
          tricks++;
        }
      }
      if (length > 3) {
        tricks += 2 * (length - 3);
      }
    }
    return tricks;
  }
}
