import { ApiContract, ApiRules } from "../../api/interfaces";
import { Card } from "../Card";
import { Deal } from "../Deal";
import { Player } from "../Player";
import { alwaysPlayWinner } from "./rules/AlwaysPlayWinner";

// eslint-disable-next-line
export function applyRuleFilters(moves: Card[], position: Deal, player: Player, rules: ApiRules, contract?: ApiContract): Card[] {

  if (!moves || !moves.length) return moves;
  if (!rules) return moves;

  // Pro-tip: you can really improve things using these rules!

  const lastResult: Card[] = alwaysPlayWinner(moves, position, player, rules);
  if (lastResult && lastResult.length > 0) {
    return rules.noDeepSearch ? [ lastResult[0] ] : lastResult;
  }

  return rules.noDeepSearch ? [ moves[Math.floor(Math.random() * moves.length)] ] : moves;
}
