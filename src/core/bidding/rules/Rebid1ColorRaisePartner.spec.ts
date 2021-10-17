
import { NoTrump } from "../../deck/NoTrump";
import { Clubs, Hearts, Spades } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { Rebid1ColorRaisePartner } from "./Rebid1ColorRaisePartner";

describe('core.bidding.rules.Rebid1ColorRaisePartner', () => {
  it('raise the partner to2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("3,2", "K,Q,J,2", "9,8", "A,K,5,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.makeBid(2, Hearts, false));
  });

  it('raise the partner to2 another color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("9,5,3,2", "A,Q", "9,8", "A,K,5,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.makeBid(2, Spades, false));
  });

  it('do not apply if less than4 trumps', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("9,5,3", "A,Q,2", "9,8", "A,K,5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('raise the partner to3', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("3,2", "K,Q,J,2", "K,8", "A,K,5,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.makeBid(3, Hearts, false));
  });

  it('raise the partner to4', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("3,2", "K,Q,J,2", "K,8", "A,K,J,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.makeBid(4, Hearts, false));
  });

  it('use5_3_1distributional count', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("Q,5,3,2", "Q,9,8,7", "", "A,K,5,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.makeBid(3, Spades, false));
  });

  it('do not apply to no trump response', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorRaisePartner(a, Hand.fromSuits("Q,5,3,2", "Q,9,8,7", "", "A,K,5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

});

