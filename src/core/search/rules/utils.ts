import { Card } from "../../Card";
import { Deal } from "../../Deal";
import { Suit } from "../../deck/Suit";

export function getLowestEachSuit(arr: Card[]): Card[] {
  const sortedMoves = arr.slice(0).sort((a, b) =>
    (a.denomination.index === b.denomination.index) ?
    (a.value - b.value) :
    (b.denomination.index - b.denomination.index)
  );
  const lowestEachSuit = sortedMoves.filter((card, i) => {
    if (i === 0) return true;
    if (card.denomination !== sortedMoves[i - 1].denomination) return true;
  });
  return lowestEachSuit;
}

export function getLowestAssumeOneSuit(arr: Card[]): Card[] {
  let assertFailure = false;
  arr.sort((a, b) => {
    if (a.denomination.index === b.denomination.index) {
      return (a.value - b.value);
    }
    else {
      assertFailure = true;
      return (b.denomination.index - b.denomination.index);
    }
  });
  return assertFailure ? arr : arr.slice(0, 1);
}

export function getPlayerWith(rank: string, suit: Suit, position: Deal) {
  return position.players.reduce((res, p) => {
    if (res !== undefined) return res;
    if (p.hasUnplayedCard(Card.getFromValues(rank, suit))) {
      return p.getDirection();
    }
  }, undefined);
}
