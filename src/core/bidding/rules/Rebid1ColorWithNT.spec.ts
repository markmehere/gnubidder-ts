import { NoTrump } from "../../deck/NoTrump";
import { Clubs, Diamonds } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";

import { Rebid1ColorWithNT } from "./Rebid1ColorWithNT";

describe('core.bidding.rules.Rebid1ColorWithNT', () => {

  it('balanced at 1 level', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("4,3,2", "K,Q,J,2", "9,8", "A,K,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('does not apply if not balanced', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("", "K,Q,J,3,2", "9,8,7", "A,K,5,4,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('do not apply when banced at 16 to 18', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,3,2", "K,Q,J,2", "9,8", "A,K,5,4"));
    expect(rule.getBid()).toBe(null);
  });

  it('bid at 2 when banced at 19 to 20', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,Q,2", "K,Q,J,2", "9,8", "A,K,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.TWO_NOTRUMP);
  });

  it('do not apply when banced over 20', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,Q,2", "K,Q,J,2", "Q,8", "A,K,5,4"));
    expect(rule.getBid()).toBe(null);
  });

  it('response is NT tame with 16 to 18 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,4,3,2", "K,Q,J,2", "9", "A,K,5,4"));
    expect(rule.getBid()).toBe(null);
  });

  it('response is NT not tame with 16 to 18 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,K,4,3,2", "Q,J", "9", "A,K,5,4,2"));
    expect(rule.getBid()).toBe(null);
  });

  it('response is nt tame with 19 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,Q,3,2", "K,Q,J,2", "9", "A,K,5,4"));
    expect(rule.getBid()).toEqual(null);
  });

  it('response is nt not tame with 19 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,Q,3,2", "K,Q,J,5,3,2", "9", "A,K"));
    expect(rule.getBid()).toBe(null);
  });

  it('response is NT balanced with 19 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNT(a, Hand.fromSuits("A,Q,3,2", "K,Q,J,2", "9,4", "A,K,5"));
    expect(rule.getBid()).toEqual(BidCollection.TWO_NOTRUMP);
  });

});

