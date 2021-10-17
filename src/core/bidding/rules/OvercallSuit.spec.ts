import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { OvercallSuit } from "./OvercallSuit";

describe('core.bidding.rules.OvercallSuit', () => {

  const ONE_DIAMONDS_OVERCALL_HAND = Hand.fromSuits("7,8", "4,3", "A,K,J,9,3,2", "Q,5,4");
  const ONE_HEARTS_OVERCALL_HAND = Hand.fromSuits("7,8", "A,K,J,9,3,2", "4,3", "Q,5,4");

  it('only applies to true overcalls', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    let rule = new OvercallSuit(a, ONE_DIAMONDS_OVERCALL_HAND);
    expect(rule.getBid()).toBe(null);

    const b = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    b.bid(BidCollection.ONE_CLUBS);
    b.bid(BidCollection.PASS);
    rule = new OvercallSuit(b, ONE_DIAMONDS_OVERCALL_HAND);
    expect(rule.getBid()).toBe(null);
 
    const c = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    rule = new OvercallSuit(c, ONE_DIAMONDS_OVERCALL_HAND);
    expect(rule.getBid()).toBe(null);
  });

  it('1 color at 10 to 12 suit of 6', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, ONE_DIAMONDS_OVERCALL_HAND);
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('1 color at 10 to 12 decent suit of 5', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8", "K,3,2", "Q,J,9,3,2", "A,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('good suit of 5 but less than 10 points', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8", "4,3,2", "A,K,J,9,3", "6,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('1 color at 10 to 12 poor suit of 5', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8", "A,3,2", "K,10,9,3,2", "Q,J,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('1 different color at 10 to 12', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, ONE_HEARTS_OVERCALL_HAND);
    expect(rule.getBid()).toEqual(BidCollection.ONE_HEARTS);
  });

  it('two passes precede right hand opponents opening', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, ONE_DIAMONDS_OVERCALL_HAND);
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('one pass precedes right hand opponents opening', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, ONE_DIAMONDS_OVERCALL_HAND);
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('pick amore viable color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_DIAMONDS);
    const rule = new OvercallSuit(a, Hand.fromSuits("2", "A,K,J,9,3", "", "10,9,8,7,6,3,2"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_HEARTS);
  });

  it('13 points can bid on poor 5', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8", "A,K,2", "K,J,9,3,2", "Q,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

  it('13 points can bid on poor 5 pick more viable color', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_DIAMONDS);
    const rule = new OvercallSuit(a, Hand.fromSuits("A,10,7,8,2", "", "K,J,9,3,2", "Q,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_SPADES);
  });

  it('13 points can bid 2 level if necessary', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8", "A,K", "K,J,9,4,3,2", "Q,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.TWO_DIAMONDS);
  });

  it('13 points can bid 2 level for good5', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8,2", "A,K", "K,Q,10,4,3", "Q,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.TWO_DIAMONDS);
  });

  it('13 points canot bid 2 level for decent5', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    const rule = new OvercallSuit(a, Hand.fromSuits("7,8,2", "A,K", "Q,J,10,4,3", "K,5,4"));
    expect(rule.getBid()).toBe(null);
  });

  it('16 points can bid 2 level for any 5 long suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    const rule = new OvercallSuit(a, Hand.fromSuits("K,8,2", "A,K", "K,J,9,4,3", "Q,5,4"));
    expect(rule.getBid()).toBe(null);
  });

  it('16 points bid at lowest level possible any 5 long suit', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    const rule = new OvercallSuit(a, Hand.fromSuits("K,8,2", "A,K", "K,J,9,4,3", "Q,5,4"));
    expect(rule.getBid()).toEqual(BidCollection.ONE_DIAMONDS);
  });

});

