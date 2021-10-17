
import { Player } from "./Player";
import { Direction } from "./Direction";
import { Trick } from "./Trick";
import { Four, Ace, Three, Two, Five } from "./deck/CardValues";
import { NoTrump } from "./deck/NoTrump";
import { Spades, Hearts, Clubs, Diamonds } from "./deck/SuitValues";

describe("core.Trick", () => {

  let tr: Trick;
  const dummyPlayer = new Player(Direction.SOUTH);

  beforeEach(() => {
    tr = new Trick(NoTrump);
  });
  
  it("get highest card same color", () => {
    tr.addCard(Four.of(Spades), dummyPlayer);
    const expected = Ace.of(Spades);
    tr.addCard(expected, dummyPlayer);
    tr.addCard(Three.of(Spades), dummyPlayer);
    expect(expected).toBe(tr.getHighestCard());
  });

  it("get highest unmatched color", () => {
    tr.addCard(Two.of(Spades), dummyPlayer);
    tr.addCard(Ace.of(Hearts), dummyPlayer);
    tr.addCard(Three.of(Spades), dummyPlayer);
    const expected = Four.of(Spades);
    tr.addCard(expected, dummyPlayer);    
    expect(expected).toBe(tr.getHighestCard());
  });

  it("duplicate trump", () => {
    const original = new Trick(Spades);
    const clone = original.duplicate();
    expect(clone.getTrump()).toBe(Spades);
    const original2 = new Trick(Clubs);
    const clone2 = original2.duplicate();
    expect(clone2.getTrump()).toBe(Clubs);
  });

  it("get highest trump more than one trump", () => {
    tr.setTrump(Spades);
    tr.addCard(Two.of(Spades), dummyPlayer);
    const expected = Four.of(Spades);
    tr.addCard(expected, dummyPlayer);
    tr.addCard(Ace.of(Clubs), dummyPlayer);
    tr.addCard(Three.of(Diamonds), dummyPlayer);
    expect(tr.getHighestCard()).toBe(expected);
  });

  it("second get highest trump more than one trump", () => {
    tr.setTrump(Spades);
    tr.addCard(Two.of(Spades), dummyPlayer);
    const expected = Four.of(Spades);
    tr.addCard(expected, dummyPlayer);
    tr.addCard(Two.of(Spades), dummyPlayer);
    tr.addCard(Ace.of(Clubs), dummyPlayer);
    tr.addCard(Three.of(Diamonds), dummyPlayer);
    expect(tr.getHighestCard()).toBe(expected);
  });

  it("who played one card", () => {
    const p = new Player(Direction.EAST);
    const card = Four.of(Spades);
    tr.addCard(card, p);
    expect(tr.whoPlayed(card)).toBe(p);
  });

  it("who played two cards", () => {
    const p = new Player(Direction.EAST);
    const p2 = new Player(Direction.NORTH);
    const card = Four.of(Spades);
    const card2 = Five.of(Spades);
    tr.addCard(card, p);
    tr.addCard(card2, p2);
    expect(tr.whoPlayed(card)).toBe(p);
    expect(tr.whoPlayed(card2)).toBe(p2);
  })
});
