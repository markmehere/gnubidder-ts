import { Clubs } from "../../deck/SuitValues";
import { DirectionCollection } from "../../Direction";
import { Hand } from "../../Hand";
import { Auctioneer } from "../Auctioneer";
import { BidCollection } from "../BidCollection";
import { Open2NT } from "./Open2NT";


describe('core.bidding.rules.Open2NT', () => {

  it('pass on 1NT call', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open2NT(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(rule.getBid()).toEqual(null);
  });

  it('bid 2NT with an extra ace', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open2NT(a, Hand.fromSuits("A,K,2", "A,Q,3", "A,8,6,3", "K,J,3"));
    expect(rule.getBid()).toEqual(BidCollection.TWO_NOTRUMP);
  });

  it('bid 2NT with an queen and jack', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const rule = new Open2NT(a, Hand.fromSuits("K,Q,2", "A,Q,3", "A,J,6,3", "K,J,3"));
    expect(rule.getBid()).toEqual(BidCollection.TWO_NOTRUMP);
  });

  it('only an opening not a response', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    a.bid(BidCollection.makeBid(1, Clubs, false));
    a.bid(BidCollection.PASS);
    const rule = new Open2NT(a, Hand.fromSuits("K,Q,2", "A,Q,3", "A,J,6,3", "K,J,3"));
    expect(rule.getBid()).toEqual(null);
  });
});

