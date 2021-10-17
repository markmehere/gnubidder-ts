import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { Respond1ColorRaiseMajorSuit } from "./Respond1ColorRaiseMajorSuit";

describe('core.bidding.rules.Respond1ColorRaiseMajorSuit', () => {

  it('only applies to major suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_DIAMONDS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,5,4,3", "9,8,6",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('only applies to partners bid at 1 level', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.TWO_HEARTS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,5,4,3", "9,8,6",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('insufficient cards in suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_HEARTS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,5,4", "9,8,6,5",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('raise the partner by 1 also on spades', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,Q,3,2", "K,5,4", "9,8,6,5",
        "5,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.TWO_SPADES);
  });

  it('do not apply if less than 6 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "9,5,4", "9,8,6,5",
        "5,4,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('count bonus distributional points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("J,4,3,2", "9,5,4",
        "9,8,6,5,4,3", ""));

    expect(rule.getBid()).toBe(null);
  });

  it('do not apply if less than 3 trumps', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_HEARTS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,5", "9,8,6,5",
        "5,4,3,2"));

    expect(rule.getBid()).toBe(null);
  });

  it('raise the partner by 2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_HEARTS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,6,5,4", "A,8,6",
        "J,4,3"));

    expect(rule.getBid()).toEqual(BidCollection.THREE_HEARTS);
  });

  it('raise the partner by 1', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_HEARTS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("J,3,2", "K,J,5,4", "J,6,5",
        "K,3,2"));

    expect(rule.getBid()).toEqual(BidCollection.TWO_HEARTS);
  });

  it('raise the partner by 1 do not apply over 16 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_HEARTS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,5,4", "A,8,6,5",
        "A,K,3"));

    expect(rule.getBid()).toBe(null);
  });

  it('can handle partners pass without np e', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    const rule = new Respond1ColorRaiseMajorSuit(a, Hand.fromSuits("K,3,2", "K,5,4", "A,8,6,5", "A,K,3"));

    expect(rule.getBid()).toBe(null);
  });

});

