import { NoTrump } from "../deck/NoTrump";
import { Clubs, Spades, Hearts } from "../deck/SuitValues";
import { BidCollection } from "./BidCollection";
import { ScoreCalculator } from "./ScoreCalculator";
import { Vulnerability } from "./Vulnerability";


describe('Score Calculator', () => {

  it('one minor suit contract made with no overtricks', () => {
    const tricksTakenByDeclarers = 7;
    const calculator = new ScoreCalculator(BidCollection.ONE_CLUBS, tricksTakenByDeclarers, new Vulnerability(false,
        false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();
    expect(actualDeclarerScore).toBe(70);
    expect(actualDefenderScore).toBe(0);
  });

  it('one major suit contract with two overtricks', () => {
    const tricksTakenByDeclarers = 9;
    const calculator = new ScoreCalculator(BidCollection.ONE_SPADES, tricksTakenByDeclarers, new Vulnerability(false,
        false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();
    expect(actualDeclarerScore).toBe(140);
    expect(actualDefenderScore).toBe(0);
  });

  it('grand slam', () => {
    const tricksTakenByDeclarers = 13;
    const calculator = new ScoreCalculator(BidCollection.makeBid(7, Clubs, false), tricksTakenByDeclarers, new Vulnerability(
        false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();
    expect(actualDeclarerScore).toBe(1000 + 7 * 20);
    expect(actualDefenderScore).toBe(0);
  });

  it('small slam', () => {
    const tricksTakenByDeclarers = 12;
    const calculator = new ScoreCalculator(BidCollection.makeBid(6, Spades, false), tricksTakenByDeclarers, new Vulnerability(
        false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();
    expect(actualDeclarerScore).toBe(500 + 6 * 30);
    expect(actualDefenderScore).toBe(0);
    expect(actualDefenderScore).toBe(0);
  });

  it('n twith over tricks', () => {
    const tricksTakenByDeclarers = 9;
    const calculator = new ScoreCalculator(BidCollection.makeBid(2, NoTrump, false), tricksTakenByDeclarers,
        new Vulnerability(false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();
    /* 3 * 30 + 10 makes a 100 poconst game, but the contract was only 70, so it is not a
     *   a "game" - should be 100 points + 50 for a partscore*/

    expect(actualDeclarerScore).toBe(150);
    expect(actualDefenderScore).toBe(0);
  });

  it('n twithout over tricks', () => {
    const tricksTakenByDeclarers = 9;
    const calculator = new ScoreCalculator(BidCollection.makeBid(3, NoTrump, false), tricksTakenByDeclarers,
        new Vulnerability(false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    /* Now the contract is worth 100, so the 300 game bonus kicks in */
    expect(actualDeclarerScore).toBe(400);
    expect(actualDefenderScore).toBe(0);
  });

  it('undertricks nt', () => {
    const tricksTakenByDeclarers = 6;
    const calculator = new ScoreCalculator(BidCollection.makeBid(3, NoTrump, false), tricksTakenByDeclarers,
        new Vulnerability(false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(0);
    expect(actualDefenderScore).toBe(150);
  });

  it('undertricks major suit', () => {
    const tricksTakenByDeclarers = 2;
    const calculator = new ScoreCalculator(BidCollection.makeBid(7, Hearts, false), tricksTakenByDeclarers, new Vulnerability(
        false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(0);
    expect(actualDefenderScore).toBe(550);
  });

  it('undertricks minor suit', () => {
    const tricksTakenByDeclarers = 12;
    const calculator = new ScoreCalculator(BidCollection.makeBid(7, Clubs, false), tricksTakenByDeclarers, new Vulnerability(
        false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(0);
    expect(actualDefenderScore).toBe(50);
  });

  it('vulnerability', () => {
    const tricksTakenByDeclarers = 6;
    const calculator = new ScoreCalculator(BidCollection.makeBid(2, Hearts, false), tricksTakenByDeclarers, new Vulnerability(
        true, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(0);
    expect(actualDefenderScore).toBe(200);
  });

  it('vulnerability win contract', () => {
    const tricksTakenByDeclarers = 7;
    const calculator = new ScoreCalculator(BidCollection.makeBid(1, Hearts, false), tricksTakenByDeclarers, new Vulnerability(
        true, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(80);
    expect(actualDefenderScore).toBe(0);
  });

  it('doubled contract met', () => {
    const tricksTakenByDeclarers = 7;
    const calculator = new ScoreCalculator(BidCollection.makeBid(1, Hearts, false).makeDoubledAndClone(), tricksTakenByDeclarers,
        new Vulnerability(false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(110);
    expect(actualDefenderScore).toBe(0);
  });

  it('doubled contract overtricks', () => {
    const tricksTakenByDeclarers = 9;
    const calculator = new ScoreCalculator(BidCollection.makeBid(1, Hearts, false).makeDoubledAndClone(), tricksTakenByDeclarers,
        new Vulnerability(false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(110 + 100 * 2);
    expect(actualDefenderScore).toBe(0);
  });

  it('doubled contract undertricks', () => {
    const tricksTakenByDeclarers = 5;
    const calculator = new ScoreCalculator(BidCollection.makeBid(1, Hearts, false).makeDoubledAndClone(), tricksTakenByDeclarers,
        new Vulnerability(false, false));
    const actualDeclarerScore = calculator.getDeclarerScore();
    const actualDefenderScore = calculator.getDefenderScore();

    expect(actualDeclarerScore).toBe(0);
    expect(actualDefenderScore).toBe(100 + 200);
  });

});

