import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { Overcall1NT } from "./Overcall1NT";

describe('core.bidding.rules.Overcall1NT', () => {

  it('make overcall with 16 to 18 HCP balanced hand and stopper in enemy suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new Overcall1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('do not apply if no overcall', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    const rule = new Overcall1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('do not apply if less than 16 HCP', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new Overcall1NT(a, Hand.fromSuits("7,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('do not apply if more than 18 HCP', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new Overcall1NT(a, Hand.fromSuits("A,2", "A,Q,3", "A,K,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('do not apply if imbalanced', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new Overcall1NT(a, Hand.fromSuits("2", "A,K,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('do not apply if no stopper in enemy suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new Overcall1NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,K,8,6,5,3", "J,10,3"));
    expect(rule.getBid()).toBe(null);
  });
});

