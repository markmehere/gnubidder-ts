
import { Hearts, Diamonds, Clubs } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { Respond1ColorRaiseMinorSuit } from "./Respond1ColorRaiseMinorSuit";

describe('core.bidding.rules.Respond1ColorRaiseMinorSuit', () => {

  it('only applies to minor suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "5,4,3", "K,9,8,6",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('only applies to partners bid at 1 level', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(2, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "5,4,3", "K,9,8,6",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('raise the partner by 1', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,Q,2", "10,5,4", "K,Q,T,6,5",
        "5,4"));

    expect(rule.getBid()).toEqual(BidCollection.TWO_DIAMONDS);
  });

  it('raise the partner by 1 also on clubs', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("A,K,2", "10,5,4", "8,5",
        "K,Q,5,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.TWO_CLUBS);
  });

  it('do not apply if less than 6 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "9,5,4", "9,8,6,5",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('do not apply if less than 4 trumps', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "K,5,4", "8,6,5",
        "5,4,3,2"));

    expect(rule.getBid()).toBe(null);
  });

  it('raise the partner by 1 do not apply between 11 and 12 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "K,5,4", "A,8,6,5",
        "J,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('raise the partner by 2 typically by 5 and 8', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "J,5,4", "A,8,6,5,2",
        "T,3,2"));

    expect(rule.getBid()).toEqual(BidCollection.makeBid(3, Diamonds, false));
  });

  it('can handle partners pass', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMinorSuit(a, Hand.fromSuits("K,3,2", "K,5,4", "A,8,6,5",
        "A,K,3"));

    expect(rule.getBid()).toBe(null);
  });
});

