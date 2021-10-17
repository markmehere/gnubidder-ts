import { DirectionCollection } from "../Direction";
import { Auctioneer } from "./Auctioneer";
import { BidCollection } from "./BidCollection";

describe('core.bidding.Auctioneer', () => {

  it('first to bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    expect(a.nextToBid).toBe(DirectionCollection.WEST_INSTANCE);
    const b = new Auctioneer(DirectionCollection.SOUTH_INSTANCE);
    expect(b.nextToBid).toBe(DirectionCollection.SOUTH_INSTANCE);
  });

  it('bidding moves clockwise', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.nextToBid).toBe(DirectionCollection.NORTH_INSTANCE);
    a.bid(BidCollection.PASS);
    expect(a.nextToBid).toBe(DirectionCollection.EAST_INSTANCE);
    a.bid(BidCollection.PASS);
    expect(a.nextToBid).toBe(DirectionCollection.SOUTH_INSTANCE);
    a.bid(BidCollection.TWO_NOTRUMP);
    expect(a.nextToBid).toBe(DirectionCollection.WEST_INSTANCE);
  });

  it('end bidding contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.TWO_HEARTS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(true);
    expect(a.getHighBid()).toEqual(BidCollection.TWO_HEARTS);
    expect(a.getHighBid().equals(BidCollection.TWO_HEARTS)).toBe(true);
  });

  it('end bidding doubled contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.DOUBLE);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(true);
  });

  it('end bidding no contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.biddingFinished()).toBe(true);
    expect(a.getHighBid()).toBe(null);
  });

  it('is opening bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    expect(a.isOpeningBid()).toBe(true);
    a.bid(BidCollection.PASS);
    expect(a.isOpeningBid()).toBe(true);
    a.bid(BidCollection.PASS);
    expect(a.isOpeningBid()).toBe(true);
    a.bid(BidCollection.PASS);
    expect(a.isOpeningBid()).toBe(true);
    a.bid(BidCollection.TWO_CLUBS);
    expect(a.isOpeningBid()).toBe(false);
  });

  it('no opening bid if bid1', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    expect(a.isOpeningBid()).toBe(false);
  });

  it('no opening bid if bid2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    expect(a.isOpeningBid()).toBe(false);
  });

  it('no opening bid if bid3', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    expect(a.isOpeningBid()).toBe(false);
  });

  it('can traverse pairs history with get partners bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_CLUBS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_DIAMONDS);
    a.bid(BidCollection.ONE_HEARTS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.ONE_NOTRUMP);
    const c8 = a.getLastCall();
    expect(c8.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
    const c6 = a.getPartnersCall(c8);
    expect(c6).not.toBeNull();
    expect(c6.getBid()).toEqual(BidCollection.PASS);
    const c4 = a.getPartnersCall(c6);
    expect(c4.getBid()).toEqual(BidCollection.ONE_HEARTS);
    const c2 = a.getPartnersCall(c4);
    expect(c2.getBid()).toEqual(BidCollection.PASS);
    expect(a.getPartnersCall(c2)).toBeNull();
    const c7 = a.getPartnersLastCall();
    expect(c7.getBid()).toEqual(BidCollection.ONE_SPADES);
  });

  it('is valid any bid valid at start', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    expect(a.isValid(BidCollection.PASS)).toBe(true);
    expect(a.isValid(BidCollection.ONE_NOTRUMP)).toBe(true);
    expect(a.isValid(BidCollection.SEVEN_DIAMONDS)).toBe(true);
  });

  it('is valid pass always valid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.isValid(BidCollection.PASS)).toBe(true);
  });

  it('is valid only higher than current', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.isValid(BidCollection.ONE_CLUBS)).toBe(false);
    expect(a.isValid(BidCollection.ONE_NOTRUMP)).toBe(false);
    expect(a.isValid(BidCollection.TWO_CLUBS)).toBe(true);
  });

  it('is valid double ok after opponent bids', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(true);
  });

  it('is valid double is not avalid response to another double', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.DOUBLE);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
  });

  it('is valid may not double your own double', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.DOUBLE);
    a.bid(BidCollection.PASS);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
  });

  it('is valid may not double partner', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
  });

  it('is valid not ok to open with double', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
    a.bid(BidCollection.PASS);
    expect(a.isValid(BidCollection.DOUBLE)).toBe(false);
  });

  it('doubling affects the high bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.getHighBid().isDoubled()).toBe(false);
    a.bid(BidCollection.DOUBLE);
    expect(a.getHighBid().isDoubled()).toBe(true);
  });

  it('doubling does not change the high bid value', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.getHighBid()).toEqual(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.DOUBLE);
    expect(a.getHighBid().equals(BidCollection.ONE_NOTRUMP)).toBe(true);
    expect(a.getHighBid()).not.toEqual(BidCollection.ONE_NOTRUMP);
  });

  it('doubling does not change the high call player', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.DOUBLE);
    expect(a.getHighCall().getDirection()).toBe(DirectionCollection.WEST_INSTANCE);
  });

  it('get dummy null if auction not finished', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    expect(a.getDummy()).toBeNull();
    a.bid(BidCollection.ONE_NOTRUMP);
    expect(a.getDummy()).toBe(null);
  });

  it('get dummy null if no contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(null);
  });

  it('get dummy simple contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(DirectionCollection.SOUTH_INSTANCE);
  });

  it('get dummy simple doubled contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.DOUBLE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(DirectionCollection.SOUTH_INSTANCE);
  });

  it('get dummy overbid contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.TWO_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(DirectionCollection.SOUTH_INSTANCE);
  });

  it('get dummy raised partners contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.TWO_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(DirectionCollection.EAST_INSTANCE);
  });

  it('get dummy doubled initial bid', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.DOUBLE);
    a.bid(BidCollection.TWO_DIAMONDS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(DirectionCollection.WEST_INSTANCE);
  });

  it('get dummy two round contract', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.TWO_DIAMONDS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.THREE_DIAMONDS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.THREE_NOTRUMP);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.PASS);
    expect(a.getDummy()).toBe(DirectionCollection.EAST_INSTANCE);
  });

  it('get dummy direction offset', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.getDummy =  () => DirectionCollection.WEST_INSTANCE;
    expect(a.getDummyOffsetDirection(DirectionCollection.SOUTH_INSTANCE)).toBe(DirectionCollection.WEST_INSTANCE);
    expect(a.getDummyOffsetDirection(DirectionCollection.WEST_INSTANCE)).toBe(DirectionCollection.NORTH_INSTANCE);
    expect(a.getDummyOffsetDirection(DirectionCollection.NORTH_INSTANCE)).toBe(DirectionCollection.EAST_INSTANCE);
    expect(a.getDummyOffsetDirection(DirectionCollection.EAST_INSTANCE)).toBe(DirectionCollection.SOUTH_INSTANCE);

  });

  it('is overcall', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_DIAMONDS);
    a.bid(BidCollection.ONE_SPADES);
    expect(a.isOvercall(BidCollection.ONE_SPADES)).toBe(true);
    expect(a.isOvercall(BidCollection.ONE_DIAMONDS)).toBe(false);
  });

  it('is overcall2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_DIAMONDS);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.TWO_DIAMONDS);
    expect(a.isOvercall(BidCollection.ONE_SPADES)).toBe(true);
    expect(a.isOvercall(BidCollection.TWO_DIAMONDS)).toBe(true);
  });

  it('is overcall3', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_DIAMONDS);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.PASS);
    expect(a.isOvercall(BidCollection.ONE_SPADES)).toBe(true);
  });

  it('is not an overcall', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    expect(a.isOvercall(BidCollection.ONE_SPADES)).toBe(false);
  });

  it('is not an overcall2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.PASS);
    a.bid(BidCollection.ONE_SPADES);
    expect(a.isOvercall(BidCollection.ONE_SPADES)).toBe(false);
  });

  it('pass is not an overcall', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.ONE_SPADES);
    a.bid(BidCollection.PASS);
    expect(a.isOvercall(BidCollection.PASS)).toBe(false);
  });

});

