import { ApiRules } from "../../../api/interfaces";
import { Card } from "../../Card";
import { Deal } from "../../Deal";
import { Player } from "../../Player";
import { getLowestAssumeOneSuit, getLowestEachSuit } from "./utils";

/*
  IF it is the last play of the trick
  |-> IF the partner is not winning
      |-> FIND the winning cards
          |-> RETURN for consideration the lowest winning card

  IF it is the last play of the trick
  |-> IF the partner is winning
      |-> IF neverTakeFromPartner is true
          |-> RETURN for consideration the lowest of each suit minus the trump suit if possible
*/

export function alwaysPlayWinner(moves: Card[], position: Deal, player: Player, rules: ApiRules): Card[] {
  if (rules.alwaysPlayWinnerOnLastTurn) {
    const curTrick = position.currentTrick;
    if (curTrick.getCardsPlayed() === 3) {
      const partnerIsWinning = curTrick.whoPlayed(curTrick.getHighestCard()).isPartnerWith(player);
      if (!partnerIsWinning || (partnerIsWinning && rules.neverTakeFromPartner)) {
        if (partnerIsWinning) {
          const inversionLowestEachSuit = getLowestEachSuit(moves);
          if (inversionLowestEachSuit.length > 1) return inversionLowestEachSuit.filter((card) => card.denomination !== position.trump);
          else return inversionLowestEachSuit;
        }
        else {
          const candidate = moves.filter(card => {
            const trick = curTrick.duplicate();
            trick.addCard(card, player);
            return trick.whoPlayed(trick.getHighestCard()) === player;
          });
          if (!partnerIsWinning && candidate.length > 0) {
            return getLowestAssumeOneSuit(candidate);
          }
        }
      }
    }
  }
  return null;
}
