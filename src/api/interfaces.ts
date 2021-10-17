/* This file only under CC0 - public domain */

import { Direction } from "../core/Direction";

export const directionToKey = {
  N: 'north',
  E: 'east',
  S: 'south',
  W: 'west'
};

export const keyToGnubridgeDirection = {
  'north': Direction.NORTH,
  'east': Direction.EAST,
  'south': Direction.SOUTH,
  'west': Direction.WEST
};

export enum ApiDirection {
  North = 'N',
  East = 'E',
  South = 'S',
  West = 'W'
}

export interface ApiContract {
  west: string[];
  north: string[];
  east: string[];
  south: string[];
  highestBid: string;
  declarer?: ApiDirection;
  dummy?: ApiDirection;
  doubled: boolean;
  redoubled: boolean;
  passCount: number;
}

export interface ApiDealtHands {
  west: string[];
  pwest: string[];
  north: string[];
  pnorth: string[];
  east: string[];
  peast: string[];
  south: string[];
  psouth: string[];
  northsouthwon: ApiTrickCards[];
  eastwestwon: ApiTrickCards[];
  nextToPlay: ApiDirection;
  playedCards: string[];
  winningCards: string[];
}

export interface ApiTrickCards {
  opening: string;
  west: string;
  north: string;
  east: string;
  south: string;
  order: ApiDirection[];
  done: boolean;
}

export interface BiddingMessageEventBody {
  dealtHands: ApiDealtHands;
  contract?: ApiContract;
}

export interface PlayingMessageEventBody {
  dealtHands: ApiDealtHands;
  contract: ApiContract;
  currentTrick?: ApiTrickCards;
  doNotRespondCacheOnly?: boolean;
}

/* see README for recommended settings */
export interface ApiRules {

  disableBetaPrune?: boolean;
  disableAlphaPrune?: boolean;
  considerPrunedMoves?: boolean;
  neverTakeFromPartner?: boolean;
  printDebug?: boolean;
  alwaysPlayWinnerOnLastTurn?: boolean;

  /* values - see README */
  trickPenalty?: number; /* (usually 0.05) */
  facePenalty?: number; /* (usually 0.02) */
  shortSuitBump?: number; /* (usually 0.1) */
  bumpRequires?: number; /* (usually 6) */
  faceOffset?: number; /* (usually 2) */
  maxTricks?: number; /* (usually 3) */
  maxSearch?: number; /* (usually 150,000) */
  noDeepSearch?: boolean; /* a property that deliberately degrades performance (we hope) */
  disableDuplicateRemoval?: boolean; /* a property that disables buggy duplicate removal */

}

/* End CC0 */
