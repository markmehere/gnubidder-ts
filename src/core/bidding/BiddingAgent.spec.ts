import { DirectionCollection } from "../Direction";
import { Hand } from "../Hand";
import { Auctioneer } from "./Auctioneer";
import { Bid } from "./Bid";
import { BidCollection } from "./BidCollection";
import { BiddingAgent } from "./BiddingAgent";
import { RPQuizzes } from "./RPQuizzes";

describe('Bidding Agent', () => {
  let auctioneer: Auctioneer;
	let agent: BiddingAgent;

  function expectPlayerToBid(bid: Bid, useEqual = false) {
    if (useEqual) expect(bid.equals(agent.getBid())).toBe(true);
    else expect(bid).toEqual(agent.getBid());
  }

  function givenNoPriorBids() {
     auctioneer = new Auctioneer(DirectionCollection.WEST_INSTANCE);
   }

  function andPlayersCards(...cardsBySuits: string[]) {
    agent = new BiddingAgent(auctioneer, Hand.fromSuits(cardsBySuits[0], cardsBySuits[1], cardsBySuits[2], cardsBySuits[3]));
  }

  // eslint-disable-next-line
  function givenPlayersCards(...cardsBySuits: string[]) {
    givenNoPriorBids();
    agent = new BiddingAgent(auctioneer, Hand.fromSuits(cardsBySuits[0], cardsBySuits[1], cardsBySuits[2], cardsBySuits[3]));
  }

  function givenBidding(...bids: Bid[]) {
    givenNoPriorBids();
    bids.forEach(bid => auctioneer.bid(bid));
  }

  it('opening one nt', () => {
    givenNoPriorBids();
    andPlayersCards("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3");
    expectPlayerToBid(BidCollection.ONE_NOTRUMP);
  });

  it('major suit 1 nt response', () => {
    givenBidding(BidCollection.ONE_NOTRUMP, BidCollection.PASS);
    andPlayersCards("9,8,7,6,2", "A,3", "6,5,3", "5,4,3");
    expectPlayerToBid(BidCollection.TWO_HEARTS);
  });

  it('openers response to major suit response to1 nt', () => {
    givenBidding(BidCollection.ONE_NOTRUMP, BidCollection.PASS, BidCollection.THREE_HEARTS, BidCollection.PASS);
    andPlayersCards("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3");
    expectPlayerToBid(BidCollection.FOUR_HEARTS);
  });

  it('opening one nt sequence', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const west = new BiddingAgent(a, Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3"));
    expect(west.getBid()).toEqual(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.ONE_NOTRUMP);
    a.bid(BidCollection.PASS);
    const east = new BiddingAgent(a, Hand.fromSuits("K,8,7,6", "A,3,2", "6,5,3", "Q,4,3"));
    expect(east.getBid()).toEqual(BidCollection.TWO_CLUBS);
    a.bid(BidCollection.TWO_NOTRUMP);
    a.bid(BidCollection.PASS);
    expect(west.getBid()).toEqual(BidCollection.THREE_NOTRUMP);
  });

  it('open one color 5 color suit', () => {
    givenNoPriorBids();
    andPlayersCards("K,2", "A,3", "A,8,6,5,3", "5,4,3");
    expectPlayerToBid(BidCollection.ONE_DIAMONDS);
  });

  it('respond 1 color with new suit', () => {
    givenBidding(BidCollection.ONE_DIAMONDS, BidCollection.PASS);
    andPlayersCards("K,3", "K,5,4,3,2", "9,8", "5,4,3,2");
    expectPlayerToBid(BidCollection.ONE_HEARTS);
  });

  it('respond 1 color raises major suit', () => {
    givenBidding(BidCollection.ONE_SPADES, BidCollection.PASS);
    andPlayersCards("K,3,2", "K,5,4,3", "9,8,6", "5,4,3");
    expectPlayerToBid(BidCollection.ONE_NOTRUMP, true);
  });

  it('respond 1 color raises major suit supercedes new suit', () => {
    givenBidding(BidCollection.ONE_HEARTS, BidCollection.PASS);
    andPlayersCards("K,10,7,6", "A,9,8,3", "A,8,6,4,2", "");
    expectPlayerToBid(BidCollection.TWO_DIAMONDS);
  });

  it('respond 1 color raises minor suit', () => {
    givenBidding(BidCollection.ONE_CLUBS, BidCollection.PASS);
    andPlayersCards("K,3,2", "5,4,3", "9,8,6", "K,5,4,3");
    expectPlayerToBid(BidCollection.ONE_NOTRUMP);
  });

  it('respond 1 color bids nt', () => {
    //only way to keep form bidding new suit or raising partner was to have opponents bid
    givenBidding(BidCollection.ONE_CLUBS, BidCollection.ONE_DIAMONDS);
    andPlayersCards("K,3,2", "A,J,4", "K,8,6,3", "K,5,4");
    expectPlayerToBid(BidCollection.THREE_NOTRUMP);
  });

  it('rebid responders color', () => {
    givenBidding(BidCollection.ONE_CLUBS, BidCollection.PASS, BidCollection.ONE_DIAMONDS, BidCollection.TWO_CLUBS);
    andPlayersCards("J,8,6", "", "K,7,5,2", "A,K,J,10,9,2");
    expectPlayerToBid(BidCollection.THREE_DIAMONDS);
  });

  it('rebid new suit', () => {
    givenBidding(BidCollection.ONE_CLUBS, BidCollection.PASS, BidCollection.ONE_DIAMONDS, BidCollection.PASS);
    andPlayersCards("J,5,4,2", "8,4", "A,K,9", "K,5,4,3");
    expectPlayerToBid(BidCollection.ONE_SPADES);
  });

  it('rebid original suit', () => {
    givenBidding(BidCollection.ONE_HEARTS, BidCollection.PASS, BidCollection.ONE_SPADES, BidCollection.PASS);
    andPlayersCards("3,2", "A,K,5,4,3,2", "K,Q,J", "K,8");
    expectPlayerToBid(BidCollection.THREE_HEARTS);
  });

  it('rebid 1 color with nt', () => {
    givenBidding(BidCollection.ONE_SPADES, BidCollection.PASS, BidCollection.ONE_NOTRUMP, BidCollection.PASS);
    andPlayersCards("A,Q,4,3", "K,Q,J", "9,3,2", "A,K,5");
    expectPlayerToBid(BidCollection.TWO_NOTRUMP);
  });

  it('overcall 1 color with own color', () => {
    givenBidding(BidCollection.ONE_CLUBS);
    andPlayersCards("7,8", "4,3", "A,K,J,9,3,2", "Q,5,4");
    expectPlayerToBid(BidCollection.ONE_DIAMONDS);
  });

  it('respond to overcall', () => {
    givenBidding(BidCollection.ONE_CLUBS, BidCollection.TWO_DIAMONDS, BidCollection.PASS);
    andPlayersCards("10,9,8,7", "K,3,2", "A,J,9", "9,5,4");
    expectPlayerToBid(BidCollection.THREE_DIAMONDS);
  });

  it('overcall 1 nt', () => {
    givenBidding(BidCollection.ONE_CLUBS);
    andPlayersCards("A,K,2", "A,Q,3", "8,6,5,3", "K,J,3");
    expectPlayerToBid(BidCollection.ONE_NOTRUMP);
  });

  it('respond overcall1 nt', () => {
    givenBidding(BidCollection.ONE_CLUBS, BidCollection.ONE_NOTRUMP, BidCollection.PASS);
    andPlayersCards("9,8,7,6,2", "A,3", "6,5,3", "Q,4,3");
    expectPlayerToBid(BidCollection.TWO_HEARTS);
  });

  it('have to bid something', () => {
    givenNoPriorBids();
    andPlayersCards("5,4,3,2", "5,4,3", "6,5,3", "5,4,3");
    expectPlayerToBid(BidCollection.PASS);
  });

  it('RP2', () => {
    const a = new Auctioneer(DirectionCollection.WEST_INSTANCE);
    const ba = new BiddingAgent(a, RPQuizzes.Basics.Lesson2.hand2());
    expect(ba.getBid()).toBe(BidCollection.PASS);
  });

});

