import { Card } from "../../Card";
import { Deal } from "../../Deal";
import { NoTrump } from "../../deck/NoTrump";
import { SuitCollection } from "../../deck/SuitCollection";
import { Direction } from "../../Direction";
import { Player } from "../../Player";
import { alwaysPlayWinner } from "./AlwaysPlayWinner";

describe('search.rules.AlwaysPlayWinner', () => {

  const defaultAvailableMoves = [
    Card.get('AS'), Card.get('KS'), Card.get('8S'), 
    Card.get('5H'), Card.get('3H'),
    Card.get('AD'), Card.get('5D'), Card.get('4D'),
  ];
  const onlyDiamondMoves = [
    Card.get('AD'), Card.get('5D'), Card.get('4D')
  ];
  const defaultPositionClubTrump = new Deal(SuitCollection.get('C'));
  const defaultPositionDiamondTrump = new Deal(SuitCollection.get('D'));
  const alternatePositionDiamondTrump = new Deal(SuitCollection.get('D'));
  const anotherPositionDiamondTrump = new Deal(SuitCollection.get('D'));
  const defaultPositionNoTrump = new Deal(NoTrump);
  const defaultPlayer = new Player(Direction.SOUTH);

  const west = new Player(Direction.WEST);
  const north = new Player(Direction.NORTH);
  const east = new Player(Direction.EAST);

  defaultPositionClubTrump.currentTrick.addCard(Card.get('2C'), west);
  defaultPositionClubTrump.currentTrick.addCard(Card.get('JC'), north);
  defaultPositionClubTrump.currentTrick.addCard(Card.get('9C'), east);

  defaultPositionDiamondTrump.currentTrick.addCard(Card.get('2C'), west);
  defaultPositionDiamondTrump.currentTrick.addCard(Card.get('6D'), north);
  defaultPositionDiamondTrump.currentTrick.addCard(Card.get('9C'), east);

  alternatePositionDiamondTrump.currentTrick.addCard(Card.get('2C'), west);
  alternatePositionDiamondTrump.currentTrick.addCard(Card.get('JC'), north);
  alternatePositionDiamondTrump.currentTrick.addCard(Card.get('9C'), east);

  anotherPositionDiamondTrump.currentTrick.addCard(Card.get('2C'), west);
  anotherPositionDiamondTrump.currentTrick.addCard(Card.get('8C'), north);
  anotherPositionDiamondTrump.currentTrick.addCard(Card.get('AC'), east);

  defaultPositionNoTrump.currentTrick.addCard(Card.get('2D'), west);
  defaultPositionNoTrump.currentTrick.addCard(Card.get('6D'), north);
  defaultPositionNoTrump.currentTrick.addCard(Card.get('9D'), east);

  it('does not activate on no rule', () => {
    expect(alwaysPlayWinner(defaultAvailableMoves, defaultPositionClubTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: false
    })).toBeNull();
    expect(alwaysPlayWinner(defaultAvailableMoves, defaultPositionDiamondTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: false
    })).toBeNull();
    expect(alwaysPlayWinner(defaultAvailableMoves, alternatePositionDiamondTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: false
    })).toBeNull();
    expect(alwaysPlayWinner(onlyDiamondMoves, defaultPositionNoTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: false
    })).toBeNull();
  });

  it('has no winners returns null', () => {
    expect(alwaysPlayWinner(defaultAvailableMoves, defaultPositionClubTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true
    })).toBeNull();
  });

  it('partner is winning, diamonds trump returns throwaways', () => {
    expect(alwaysPlayWinner(defaultAvailableMoves, defaultPositionDiamondTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true,
      neverTakeFromPartner: true
    })).toEqual([
      Card.get('8S'),
      Card.get('3H')
    ]);
  });

  it('partner is winning, diamonds trump returns throwaways', () => {
    expect(alwaysPlayWinner(defaultAvailableMoves, alternatePositionDiamondTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true,
      neverTakeFromPartner: true
    })).toEqual([
      Card.get('8S'),
      Card.get('3H')
    ]);
  });

  it('partner is losing, diamonds trump returns lowest diamond', () => {
    expect(alwaysPlayWinner(defaultAvailableMoves, anotherPositionDiamondTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true,
      neverTakeFromPartner: true
    })).toEqual([
      Card.get('4D')
    ]);
    expect(alwaysPlayWinner(defaultAvailableMoves, anotherPositionDiamondTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true,
      neverTakeFromPartner: false
    })).toEqual([
      Card.get('4D')
    ]);
  });

  it('player must play AD to win', () => {
    expect(alwaysPlayWinner(onlyDiamondMoves, defaultPositionNoTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true,
      neverTakeFromPartner: true
    })).toEqual([
      Card.get('AD')
    ]);
    expect(alwaysPlayWinner(onlyDiamondMoves, defaultPositionNoTrump, defaultPlayer, {
      alwaysPlayWinnerOnLastTurn: true,
      neverTakeFromPartner: false
    })).toEqual([
      Card.get('AD')
    ]);
  });
});
