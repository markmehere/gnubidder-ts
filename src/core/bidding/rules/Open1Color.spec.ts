
import { Diamonds, Clubs, Hearts, Spades } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { RPQuizzes } from "../RPQuizzes";
import { Open1Color } from "./Open1Color";

describe('core.bidding.rules.Open1NT', () => {
  it('open one color 5 color suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, Hand.fromSuits("K,2", "A,3", "A,8,6,5,3", "5,4,3"));
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
  });

  it('cannot open one color if responding', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    const rule = new Open1Color(a, Hand.fromSuits("K,2", "A,3", "A,8,6,5,3", "5,4,3"));
    expect(rule.getBid()).toBeNull();
  });

  it('cannot open one color if higher bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    const rule = new Open1Color(a, Hand.fromSuits("K,2", "A,3", "A,8,6,5,3", "5,4,3"));
    expect(rule.getBid()).toBeNull();
  });

  it('open one color two 5 color suits bid higher', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, Hand.fromSuits("K,2", "9,8,7,5,3", "A,K,8,6,5", "2"));
    expect(BidCollection.makeBid(1, Hearts, false)).toEqual(rule.getBid());
  });

  it('open one color 6 color suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, Hand.fromSuits("K,2", "A,Q,7,5,3", "10,9,8,6,5,4"));
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
  });

  it('open one color no 5 bid longer minor', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, Hand.fromSuits("K,Q,J,2", "Q,7,5,4", "10,9,8", "A,2"));
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
    const triangulate = new Open1Color(a, Hand.fromSuits("K,Q,J,2", "Q,7,5,4", "A,2", "10,9,8"));
    expect(BidCollection.makeBid(1, Clubs, false)).toEqual(triangulate.getBid());
  });

  it('open one color no 5 minor4x4', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, Hand.fromSuits("Q,9,8", "9,7", "5,4,3,2", "A,K,Q,J"));
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
  });

  it('open one color no 5 minor3x3', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, Hand.fromSuits("K,J,2", "Q,7,5,4", "10,9,8", "A,K,10"));
    expect(BidCollection.makeBid(1, Clubs, false)).toEqual(rule.getBid());
    const triangulate = new Open1Color(a, Hand.fromSuits("K,J,2", "Q,7,5,4", "A,K,10", "10,9,8"));
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(triangulate.getBid());
  });

  it('RP2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand2());
    expect(rule.getBid()).toBeNull();
  });

  it('RP3', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand3());
    expect(BidCollection.makeBid(1, Clubs, false)).toEqual(rule.getBid());
  });

  it('RP4', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand4());
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
  });

  it('RP6', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand6());
    expect(BidCollection.makeBid(1, Spades, false)).toEqual(rule.getBid());
  });

  it('RP7', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand7());
    expect(BidCollection.makeBid(1, Clubs, false)).toEqual(rule.getBid());
  });

  it('RP8', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand8());
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
  });

  it('RP9', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand9());
    expect(BidCollection.makeBid(1, Clubs, false)).toEqual(rule.getBid());
  });

  it('RP10', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand10());
    expect(BidCollection.makeBid(1, Spades, false)).toEqual(rule.getBid());
  });


  it('RP12', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1Color(a, RPQuizzes.Basics.Lesson2.hand12());
    expect(BidCollection.makeBid(1, Diamonds, false)).toEqual(rule.getBid());
  });
});

