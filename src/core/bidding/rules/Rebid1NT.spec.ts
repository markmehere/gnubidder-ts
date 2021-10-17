import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";

import { DirectionCollection } from "../../Direction";
import { Rebid1NT } from "./Rebid1NT";
import { NoTrump } from "../../deck/NoTrump";
import { Hearts, Spades, Diamonds, Clubs } from "../../deck/SuitValues";

describe('core.bidding.rules.Rebid1NT', () => {

  it('raise to 4H if at least 3 cards in color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(3, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,2", "A,3,2", "A,Q,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(4, Hearts, false));

    const a2 = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a2.bid(BidCollection.makeBid(1, NoTrump, false));
    a2.bid(BidCollection.PASS);
    a2.bid(BidCollection.makeBid(3, Spades, false));
    a2.bid(BidCollection.PASS);
    const triangulate = new Rebid1NT(
      a2, Hand.fromSuits("A,Q,3", "K,2", "A,8,6,3", "K,J,5,3"));
    expect(triangulate.getBid()).toEqual(BidCollection.makeBid(4, Spades, false));
  });

  it('raise to 4H if doubleton in color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(3, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
        a, Hand.fromSuits("K,3,2", "A,3", "A,Q,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(4, Hearts, false));
  });

  it('do not respond if partner did not call a major color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(3, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
        a, Hand.fromSuits("K,3,2", "A,3", "A,Q,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(3, NoTrump, false));
  });

  it('pass if partner called 2 in a major color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(2, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,3,2", "A,3", "A,Q,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(3, Clubs, false));
  });

  it('2NT invitational 16 HCP', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(2, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,3,2", "A,3", "A,J,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.PASS);
  });

  it('2NT invitational 18 HCP', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(2, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,3,2", "A,3", "A,K,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(3, NoTrump, false));
  });

  it('3NT signoff', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(3, NoTrump, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,3,2", "A,3", "A,K,8,6", "K,J,5,3"));
    expect(rule.getBid()).toEqual(BidCollection.PASS);
  });

  it('do not respond if partners bid was an opening', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(3, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,3,2", "A,3", "A,Q,8,6", "K,J,5,3"));
    expect(rule.getBid()).toBeNull();
  });

  it('do not respond if partners bid was not responding to 1NT', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(3, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("K,3,2", "A,3", "A,Q,8,6", "K,J,5,3"));
    expect(rule.getBid()).toBeNull();
  });

  it('test for bug identifying partners', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, NoTrump, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    const rule = new Rebid1NT(
      a, Hand.fromSuits("A,K,5,2", "8,6,5,2", "A,Q,9", "A,7"));
    expect(rule.getBid()).toBeNull();
  });

});

