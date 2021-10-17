
import { Clubs, Diamonds, Hearts, Spades } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { Rebid1ColorWithNewSuit } from "./Rebid1ColorWithNewSuit";

describe('core.bidding.rules.Rebid1ColorWithNewSuit', () => {
  it('show unbid suit at 1 level', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("3,2", "K,Q,J,2", "9,8", "A,K,5,4,3"));
    expect(BidCollection.makeBid(1, Hearts, false)).toEqual(rule.getBid());
  });

  it('no unbid suit with 4 cards', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("3,2", "9,8", "K,Q,J,2", "A,K,5,4,3"));
    expect(rule.getBid()).toBe(null);
  });

  it('show unbid suit at 1 level another color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("K,Q,J,2", "3,2", "9,8", "A,K,5,4,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(1, Spades, false));
  });

  it('show unbid suit even though responders suit is stronger', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("J,5,4,2", "", "A,K,9,8", "A,K,5,4,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(1, Spades, false));
  });

  it('lowest bid is at 2 level reverse bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("3,2", "A,K,Q,2", "9,8", "A,K,5,4,3"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(2, Hearts, false));
  });

  it('1 level is not a reverse bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("K,Q,J,2", "9,8", "K,Q,J,3,2", "J,2"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(1, Spades, false));
  });

  it('need at least 16 for reverse bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(2, Clubs, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("K,Q,J,2", "9,8", "K,Q,J,3,2", "J,2"));
    expect(rule.getBid()).toBe(null);
  });

  it('lower ranked suit than original is not a reverse bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Hearts, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("9,8", "K,Q,J,2", "K,Q,J,3,2", "J,2"));
    expect(rule.getBid()).toEqual(BidCollection.makeBid(2, Diamonds, false));
  });

  it('jump shift to 2 level at 19 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Diamonds, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("K,Q,J,2", "A,2", "Q,8", "A,K,5,4,3"));
    const target = BidCollection.makeBid(2, Spades, true).makeGameForcingAndClone();
    expect(rule.getBid()).toEqual(target);
  });

  it('lowest bid is at 2 level do not apply to balanced hand', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.makeBid(1, Spades, false));
    a.bid(BidCollection.PASS);
    const rule = new Rebid1ColorWithNewSuit(a, Hand.fromSuits("3,2", "K,Q,J,2", "9,8,3", "A,K,5,4"));
    expect(rule.getBid()).toBe(null);
  });

});

