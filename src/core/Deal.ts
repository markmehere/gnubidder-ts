import { ApiRules } from "../api/interfaces";
import { Card } from "./Card";
import { NoTrump } from "./deck/NoTrump";
import { Suit } from "./deck/Suit";
import { SuitCollection } from "./deck/SuitCollection";
import { Trump } from "./deck/Trump";

import { DirectionInstance, Direction } from "./Direction";
import { GameUtils } from "./GameUtils";
import { Hand } from "./Hand";
import { Player, PlayerPair } from "./Player";
import { Trick } from "./Trick";

export class Deal {
  private static preInitializedGame: Deal;
  public players: Player[];
  public nextToPlay: number;
  public currentTrick: Trick;
  public done: boolean;
  public trump: Trump;
  public tricksPlayed: number;
  private previousTrick: Trick;
  public playedCards: Hand;
  private preInitializedHumanPlayer: Player;
  public winningCards: Card[];

  constructor(trump: Trump) {
    this.players = new Array<Player>(4);
    for (let i: number = Direction.WEST; i <= Direction.SOUTH; i++) {
      this.players[i] = new Player(i);
    }
    this.nextToPlay = Direction.WEST;
    this.trump = trump;
    this.currentTrick = new Trick(trump);
    this.tricksPlayed = 0;
    this.done = false;
    this.playedCards = new Hand();
    this.winningCards = [];
  }

  public getPlayer(i: Direction): Player {
    return this.players[i];
  }

  public getWest(): Player {
    return this.players[Direction.WEST];
  }

  public getNorth(): Player {
    return this.players[Direction.NORTH];
  }

  public getEast(): Player {
    return this.players[Direction.EAST];
  }

  public getSouth(): Player {
    return this.players[Direction.SOUTH];
  }

  public setPlayer(i: Direction, p: Player) {
    this.players[i] = p;
  }

  public getPlayedCardsHiToLow(color: Suit): Card[] {
    return this.playedCards.getSuitHi2Low(color);
  }

  public doNextCard(forcedMoveIndex?: number) {
    let card: Card;
    if (forcedMoveIndex === undefined) {
      card = this.players[this.nextToPlay].play(this.currentTrick);
    }
    else {
      card = this.players[this.nextToPlay].play(this.currentTrick, forcedMoveIndex);
    }
    this.playedCards.add(card);
    this.currentTrick.addCard(card, this.players[this.nextToPlay]);
    if (this.currentTrick.isDone()) {
      const winner: number = this.getWinnerIndex(this.currentTrick);
      this.nextToPlay = winner;
      this.players[winner].addTrickTaken(this.currentTrick, this.tricksPlayed);
      this.winningCards.push(this.currentTrick.cardPlayedBy(winner));
      this.previousTrick = this.currentTrick;
      this.currentTrick = new Trick(this.trump);
      this.tricksPlayed++;
    } else {
      this.nextToPlay = (this.nextToPlay + 1) % this.players.length;
    }
    if (this.players[this.nextToPlay].getUnplayedCardsCount() === 0) {
      this.done = true;
    }
  }

  public getPreviousTrick(): Trick {
    return this.previousTrick;
  }

  public getWinnerIndex(trick: Trick): number {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].hasPlayedCard(trick.getHighestCard())) {
        return i;
      }
    }
    throw new Error("Cannot find winning player for trick: " + trick);
  }

  public isDone(): boolean {
    return this.done;
  }

  public getNextToPlay(): Player {
    return this.players[this.nextToPlay];
  }

  public duplicate(): Deal {
    const result: Deal = new Deal(this.trump);
    for (let i: number = Direction.WEST; i <= Direction.SOUTH; i++) {
      result.getPlayer(i).initWithOther(this.getPlayer(i));
    }
    result.nextToPlay = this.nextToPlay;
    result.setCurrentTrick(this.currentTrick.duplicate());
    if (this.previousTrick != null) {
      result.setPreviousTrick(this.previousTrick.duplicate());
    }
    result.setPlayedCards(this.playedCards.getCardsHighToLow());
    return result;
  }

  private setPreviousTrick(trick: Trick) {
    this.previousTrick = trick;
  }

  private setPlayedCards(cards: Card[]) {
    this.playedCards = new Hand(cards);
  }

  private setCurrentTrick(trick: Trick) {
    this.currentTrick = trick;
  }

  public playMoves(moves: number[]) {
    moves.forEach((move: number) => this.doNextCard(move));
  }

  public setNextToPlay(direction: number) {
    this.nextToPlay = direction;
  }

  public getTricksTaken(pair: PlayerPair): number {
    switch (pair) {
      case PlayerPair.WEST_EAST:
        return this.getPlayer(Direction.WEST).countTricksTaken() + this.getPlayer(Direction.EAST).countTricksTaken();
      case PlayerPair.NORTH_SOUTH:
        return this.getPlayer(Direction.NORTH).countTricksTaken() + this.getPlayer(Direction.SOUTH).countTricksTaken();
      default:
        throw new Error(`Unknown pair: ${pair}`);
    }
  }

  public getDistortedTricksTaken(pair: PlayerPair, rules: ApiRules): number {
    if (!rules.trickPenalty && !rules.facePenalty && !rules.shortSuitBump) return this.getTricksTaken(pair);
    const saneFaceOffset = Math.min((rules.faceOffset || 0) + 9, 12);
    const saneBumpRequires = Math.max((rules.bumpRequires || 0), 4);
    const countTricks = (d: Direction) => this.getPlayer(d).tricks.reduce((acc, t) => acc + (1 - Math.max(t.trickNo, 0) * (rules.trickPenalty || 0)), 0);
    const countWastedFacesBy = (pair: PlayerPair) => {
      const d1 = (pair === PlayerPair.WEST_EAST) ? Direction.NORTH : Direction.WEST;
      const d2 = (pair === PlayerPair.WEST_EAST) ? Direction.SOUTH : Direction.EAST;
      const d3 = (pair === PlayerPair.WEST_EAST) ? Direction.WEST : Direction.NORTH;
      const d4 = (pair === PlayerPair.WEST_EAST) ? Direction.EAST : Direction.SOUTH;
      const tricks = this.getPlayer(d1).tricks.concat(this.getPlayer(d2).tricks);
      return tricks.reduce((acc, t) => {
        return acc +
          Math.max((t.cardPlayedBy(d3).value - saneFaceOffset) * (rules.facePenalty || 0), 0) +
          Math.max((t.cardPlayedBy(d4).value - saneFaceOffset) * (rules.facePenalty || 0), 0)
      }, 0);
    };
    const shortSuitBump = (pair: PlayerPair) => {
      if ((rules.shortSuitBump || 0) < 0.00001) return 0;
      const p1 = this.getPlayer((pair === PlayerPair.WEST_EAST) ? Direction.WEST : Direction.NORTH);
      const p2 = this.getPlayer((pair === PlayerPair.WEST_EAST) ? Direction.EAST : Direction.SOUTH);
      if (p1.hand.length < Math.max(saneBumpRequires, 4)) return 0;
      const counts1 = [ 0, 0, 0, 0 ];
      p1.hand.forEach(c => counts1[c.denomination.index]++);
      const counts2 = [ 0, 0, 0, 0 ];
      p2.hand.forEach(c => counts2[c.denomination.index]++);
      if (this.trump === NoTrump) return 0;
      if (!p1.hand[this.trump.index]) return 0;
      if (!p2.hand[this.trump.index]) return 0;
      return SuitCollection.list.map(suit => {
        if (this.trump === suit) return 0;
        const len = p1.hand.length;
        const max = Math.max((counts1[suit.index] * counts2[this.trump.index]) / len, (counts2[suit.index] * counts1[this.trump.index]) / len);
        const min = Math.min(counts1[suit.index], counts2[suit.index])
        return Math.max(max - min, 0);
      }).reduce((acc, x) => acc + x) * rules.shortSuitBump;
    };
    let result;
    switch (pair) {
      case PlayerPair.WEST_EAST:
        result = countTricks(Direction.WEST) + countTricks(Direction.EAST) - countWastedFacesBy(PlayerPair.WEST_EAST) + shortSuitBump(PlayerPair.WEST_EAST);
        break;
      case PlayerPair.NORTH_SOUTH:
        result = countTricks(Direction.NORTH) + countTricks(Direction.SOUTH) - countWastedFacesBy(PlayerPair.NORTH_SOUTH) + shortSuitBump(PlayerPair.NORTH_SOUTH);
        break;
      default:
        throw new Error(`Unknown pair: ${pair}`);
    }
    return Math.max(result, -0.7); /* we want negative numbers but -1 has a special meaning */
  }

  public oneTrickLeft(): boolean {
    return (this.currentTrick.getHighestCard() == null && this.getNextToPlay().hand.length === 1);
  }

  public setTrump(d: Trump) {
    this.trump = d;
    if (this.currentTrick != null) {
      this.currentTrick.setTrump(d);
    }
  }

  public getTricksPlayed(): number {
    return Math.floor(this.playedCards.cards.length / 4);
  }

  public getTricksPlayedSinceSearchStart(): number {
    return this.tricksPlayed;
  }

  public getPlayerDirection(d: DirectionInstance): Player {
    return this.getPlayer(d.getValue());
  }

  public isLegalMove(card: Card): boolean {
    return this.getNextToPlay().getPossibleMoves(this.currentTrick).indexOf(card) > -1;
  }

  public play(card: Card | string) {
    const c = (typeof card === 'string') ? Card.get(card) : card;
    const possibleMoves = this.getNextToPlay().getPossibleMoves(this.currentTrick);
    this.doNextCard(possibleMoves.indexOf(c));
  }

  public setHumanPlayer(p: Player) {
    this.preInitializedHumanPlayer = p;
  }

  public selectHumanPlayer(): Player {
    let result: Player;
    if (this.preInitializedHumanPlayer != null) {
      result = this.preInitializedHumanPlayer;
      this.preInitializedHumanPlayer = null;
    } else {
      result = this.players[Math.floor(Math.random() * this.players.length)];
    }
    return result;
  }

  public static setPreInitializedGame(preInitializedGame: Deal) {
    Deal.preInitializedGame = preInitializedGame;
  }

  public static construct(): Deal {
    let result: Deal;
    if (Deal.preInitializedGame != null) {
      result = Deal.preInitializedGame;
      Deal.preInitializedGame = null;
    } else {
      result = new Deal(null);
      GameUtils.initializeRandom(result.players, 13);
    }
    return result;
  }

  public printHandsDebug() {
    this.players.forEach((player: Player) => {
      console.log(`game.get${player.toString()}().init(${this.makeHandDebug(player.hand)});`);
    });
    console.log(`game.setNextToPlay(Direction.${this.getNextToPlay().toString().toUpperCase()});`);
    if (this.trump != null) {
      console.log(`game.setTrump(${this.trump.toDebugString()});`);
    }
  }

  public printHands() {
    this.players.forEach((player: Player) => {
      console.log(`${player}: ${player.hand.map(c => c.toString())}`);
    });
  }

  private makeHandDebug(cards: Card[]): string {
    let result: string = cards.map((card) => card.toDebugString()).join(", ");
    let noLeadingCommaOnFirstElement = true;
    cards.forEach((card: Card) => {
      {
        if (noLeadingCommaOnFirstElement) {
          noLeadingCommaOnFirstElement = false;
        } else {
          result += ", ";
        }
        result += card.toDebugString();
      }
    });
    return result;
  }

  public playOneTrick() {
    for (let i = 0; i < 4; i++) {
      this.play(this.getNextToPlay().hand[0]);
    }
  }

  public getKeyForWeakHashMap(): number {
    let unique = 0;
    this.playedCards.getCardsHighToLow().forEach((card: Card) => {
      unique |= (1 << card.getIndex());
    });
    unique |= (((this.getNextToPlay().getDirection() << 4) + this.getNorthSouthTricksTaken()) << 52);
    return unique;
  }

  public getNorthSouthTricksTaken(): number {
    return this.getTricksTaken(PlayerPair.NORTH_SOUTH);
  }
}
