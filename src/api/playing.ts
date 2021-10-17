/* This file only under CC0 - public domain */

import { Card } from "../core/Card";
import { Deal } from "../core/Deal";
import { NoTrump } from "../core/deck/NoTrump";
import { SuitCollection } from "../core/deck/SuitCollection";
import { Trump } from "../core/deck/Trump";
import { DirectionCollection } from "../core/Direction";
import { Hand } from "../core/Hand";
import { Player } from "../core/Player";
import { DoubleDummySolver } from "../core/search/DoubleDummySolver";
import { Trick } from "../core/Trick";
import { ApiContract, ApiDealtHands, directionToKey, ApiTrickCards, ApiDirection, ApiRules } from "./interfaces";

function getTrump(contract: ApiContract) {
  let trump: Trump;
  switch (contract.highestBid.substring(1)) {
    case 'NT':
      trump = NoTrump;
      break;
    default:
      trump = SuitCollection.get(contract.highestBid.substring(1));
      break;
  }
  return trump;
}

function formulateTrick(contract: ApiContract, players: Player[], trick?: ApiTrickCards): Trick {
  const trump = getTrump(contract);
  const result = new Trick(trump);
  if (!trick) return result;
  trick.order.forEach((d: ApiDirection) => result.addCard(Card.get(trick[directionToKey[d]]), players[DirectionCollection.fromUniversal(d).getValue()]));
  return result;
}

export function getComputerMoveWithRules(dealtHand: ApiDealtHands, contract: ApiContract, rules: ApiRules, currentTrick?: ApiTrickCards): string {
  const trump = getTrump(contract);
  const deal = new Deal(trump);
  deal.players = ['west', 'north', 'east', 'south'].map((key, i) => 
    new Player(i).initWithCardsAndPlayed(dealtHand[key].map(c => Card.get(c)), dealtHand[`p${key}`].map(c => Card.get(c))));
  deal.currentTrick = formulateTrick(contract, deal.players, currentTrick);
  deal.tricksPlayed = Math.floor(dealtHand.playedCards.length / 4);
  deal.playedCards = new Hand();
  dealtHand.playedCards.forEach(c => deal.playedCards.add(Card.get(c)));
  deal.setNextToPlay(DirectionCollection.fromUniversal(dealtHand.nextToPlay).getValue());
  
  const solver = new DoubleDummySolver(deal, null, rules);
  solver.search();

  const handCards = dealtHand[directionToKey[dealtHand.nextToPlay]];
  const bestCard = solver.getBestMoves()[0].getUniversal();
  if (handCards.indexOf(bestCard) === -1) {
    console.error("Assertion error: Computer asked to play card not in hand");
    // eslint-disable-next-line no-debugger
    debugger;
  }
  return bestCard;
}

export function getComputerMove(dealtHand: ApiDealtHands, contract: ApiContract, currentTrick?: ApiTrickCards): string {
  return getComputerMoveWithRules(dealtHand, contract, {} as ApiRules, currentTrick);
}
 
let lastRequest;
let lastResult;
let corrId = 0;

onmessage = function (e) {
  const hashCode = function(s) {
    let val = '';
    try {
      val = btoa('' + s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).replace(/=/g, '');              
    }
    catch (e) {
      undefined;
    }
    return val;
  };
  const oldCorrId = corrId;
  corrId++;
  const dealtHandsString = JSON.stringify(e.data.dealtHands);
  const contractString = JSON.stringify(e.data.contract);
  const rulesString = e.data.rules ? JSON.stringify(e.data.rules) : '';
  const trickString = e.data.currentTrick ? JSON.stringify(e.data.currentTrick) : '';
  const newRequest = `${dealtHandsString};${contractString};${trickString};${rulesString}`;
  if (e.data.doNotRespondCacheOnly) console.log(`${oldCorrId} - prefetch ${e.data.dealtHands.nextToPlay} (${hashCode(newRequest)})`);
  else console.log(`${oldCorrId} - ordinary play for ${e.data.dealtHands.nextToPlay} (${hashCode(newRequest)})`);
  if (newRequest !== lastRequest) {
    lastRequest = newRequest;
    const localDealtHands = JSON.parse(dealtHandsString);
    const localContract = JSON.parse(contractString);
    const localRules: ApiRules = rulesString ? JSON.parse(rulesString) : {};
    const localTrick = trickString ? JSON.parse(trickString) : undefined;
    lastResult = getComputerMoveWithRules(localDealtHands, localContract, localRules, localTrick);
  }
  else {
    console.log(`${oldCorrId} - Worker using cached response`);
  }
  if (!e.data.doNotRespondCacheOnly) postMessage(lastResult, undefined);
};
/* End CC0 */
