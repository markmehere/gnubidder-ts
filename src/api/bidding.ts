/* This file only under CC0 - public domain */

import { Auctioneer } from "../core/bidding/Auctioneer";
import { BidCollection } from "../core/bidding/BidCollection";
import { BiddingAgent } from "../core/bidding/BiddingAgent";
import { Card } from "../core/Card";
import { DirectionCollection } from "../core/Direction";
import { Hand } from "../core/Hand";
import { ApiContract, ApiDealtHands, directionToKey, keyToGnubridgeDirection, BiddingMessageEventBody } from "./interfaces";

function getComputerBid(dealtHands: ApiDealtHands, contract?: ApiContract): string {
  let auctioneer: Auctioneer;
  for (let i = 0; contract && contract.north[i] !== undefined; i++) {
    ['north', 'east', 'south', 'west'].forEach(key => {
      if (contract[key][i] && contract[key][i] !== ' ') {
        if (!auctioneer) auctioneer = new Auctioneer(DirectionCollection.instance(keyToGnubridgeDirection[key]));
        auctioneer.bid(BidCollection.fromUniversal(contract[key][i]));
      }
    });
  }
  if (!auctioneer) auctioneer = new Auctioneer(DirectionCollection.fromUniversal(dealtHands.nextToPlay));
  const key = directionToKey[dealtHands.nextToPlay];
  const agent: BiddingAgent = new BiddingAgent(auctioneer, new Hand(dealtHands[key].map(c => Card.get(c))));
  return BidCollection.toUniversal(agent.getBid());
}

onmessage = function(e: MessageEvent<BiddingMessageEventBody>) {
  const localDealtHands = JSON.parse(JSON.stringify(e.data.dealtHands));
  const localContract = e.data.contract ? JSON.parse(JSON.stringify(e.data.contract)) : undefined;
  const result = getComputerBid(localDealtHands, localContract);
  postMessage(result, undefined);
};

/* End CC0 */
