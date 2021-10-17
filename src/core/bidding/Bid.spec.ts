import { NoTrump } from "../deck/NoTrump";
import { Clubs, Diamonds, Hearts, Spades } from "../deck/SuitValues";
import { BidCollection } from "./BidCollection";


describe('core.bidding.Bid', () => {

  it('greater than false if same', () => {
    expect(BidCollection.PASS.greaterThan(BidCollection.PASS)).toBe(false);
    expect(BidCollection.makeBid(1, NoTrump, false)
        .greaterThan(BidCollection.makeBid(1, NoTrump, false))).toBe(false);
  });

  it('greater than color precedence', () => {
    expect(BidCollection.PASS.greaterThan(null)).toBe(true);
    expect(BidCollection.makeBid(1, Clubs, false).greaterThan(BidCollection.PASS)).toBe(true);
    expect(BidCollection.makeBid(1, Diamonds, false).greaterThan(BidCollection.makeBid(1, Clubs, false))).toBe(true);
    expect(BidCollection.makeBid(1, Hearts, false).greaterThan(BidCollection.makeBid(1, Diamonds, false))).toBe(true);
    expect(BidCollection.makeBid(1, Spades, false).greaterThan(BidCollection.makeBid(1, Hearts, false))).toBe(true);
    expect(BidCollection.makeBid(1, NoTrump, false).greaterThan(BidCollection.makeBid(1, Spades, false))).toBe(true);
  });

  it('higher value', () => {
    expect(BidCollection.makeBid(2, Clubs, false).greaterThan(BidCollection.makeBid(1, Clubs, false))).toBe(true);

  });

  it('symmetric color', () => {
    expect(BidCollection.makeBid(1, Clubs, false).greaterThan(BidCollection.PASS)).toBe(true);
    expect(BidCollection.PASS.greaterThan(BidCollection.makeBid(1, Clubs, false))).toBe(false);
  });

  it('symmetric value', () => {
    expect(BidCollection.makeBid(2, Clubs, false).greaterThan(BidCollection.makeBid(1, Clubs, false))).toBe(true);
    expect(BidCollection.makeBid(1, Clubs, false).greaterThan(BidCollection.makeBid(2, Clubs, false))).toBe(false);

    expect(BidCollection.makeBid(2, Clubs, false).greaterThan(BidCollection.makeBid(1, NoTrump, false))).toBe(true);
    expect(BidCollection.makeBid(1, NoTrump, false).greaterThan(BidCollection.makeBid(2, Clubs, false))).toBe(false);
  });

  it('transitive', () => {
    expect(BidCollection.makeBid(1, Clubs, false).greaterThan(BidCollection.PASS)).toBe(true);
    expect(BidCollection.makeBid(1, Diamonds, false).greaterThan(BidCollection.makeBid(1, Clubs, false))).toBe(true);
    expect(BidCollection.makeBid(1, Diamonds, false).greaterThan(BidCollection.PASS)).toBe(true);
  });

  it('makeBid and static class strictly equal', () => {
    expect(BidCollection.makeBid(1, Clubs, false)).toBe(BidCollection.ONE_CLUBS);
  });

  it('makeBid clone and static class equal but not strictly', () => {
    expect(BidCollection.makeBid(1, Clubs, true)).toEqual(BidCollection.ONE_CLUBS);
    expect(BidCollection.makeBid(1, Clubs, true)).not.toBe(BidCollection.ONE_CLUBS);
  });

  it('makeBid accepts string or suit', () => {
    expect(BidCollection.makeBid(1, Clubs, false)).toBe(BidCollection.ONE_CLUBS);
    expect(BidCollection.makeBid(1, 'CLUBS', false)).toBe(BidCollection.ONE_CLUBS);
    expect(BidCollection.makeBid(3, Spades, false)).toBe(BidCollection.THREE_SPADES);
    expect(BidCollection.makeBid(3, 'SPADES', false)).toBe(BidCollection.THREE_SPADES);
    expect(BidCollection.makeBid(4, Hearts, false)).toBe(BidCollection.FOUR_HEARTS);
    expect(BidCollection.makeBid(4, 'HEARTS', false)).toBe(BidCollection.FOUR_HEARTS);
    expect(BidCollection.makeBid(6, NoTrump, false)).toBe(BidCollection.SIX_NOTRUMP);
    expect(BidCollection.makeBid(6, 'NOTRUMP', false)).toBe(BidCollection.SIX_NOTRUMP);
    expect(BidCollection.makeBid(7, Diamonds, false)).toBe(BidCollection.SEVEN_DIAMONDS);
    expect(BidCollection.makeBid(7, 'DIAMONDS', false)).toBe(BidCollection.SEVEN_DIAMONDS);
  });
});

7
