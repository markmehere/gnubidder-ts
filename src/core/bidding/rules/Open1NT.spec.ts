import { Clubs } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { RPQuizzes } from "../RPQuizzes";
import { Open1NT } from "./Open1NT";

describe('core.bidding.rules.Open1NT', () => {

  it('opening one nt first call', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('do not open one nt when responding', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    a.bid(BidCollection.PASS);
    const rule = new Open1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('opening one nt second call', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    const rule = new Open1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('cannot open one nt if insufficient HCP', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1NT(a, Hand.fromSuits("K,2", "A,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('do not open one nt on imbalanced hand', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1NT(a, Hand.fromSuits("K", "A,Q,3", "A,8,6,5,3", "K,J,3,2"));
    expect(rule.getBid()).toBe(null);
  });

  it('cannot open one nt if higher bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(2, Clubs, false));
    const rule = new Open1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('RP1', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1NT(a, RPQuizzes.Basics.Lesson2.hand1());
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('RP5', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1NT(a, RPQuizzes.Basics.Lesson2.hand5());
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('RP11', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open1NT(a, RPQuizzes.Basics.Lesson2.hand11());
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

});

