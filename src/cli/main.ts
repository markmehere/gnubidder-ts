import { ApiDirection, ApiRules, directionToKey } from "../api/interfaces";
import { Auctioneer } from "../core/bidding/Auctioneer";
import { BidCollection } from "../core/bidding/BidCollection";
import { BiddingAgent } from "../core/bidding/BiddingAgent";
import { Deal } from "../core/Deal";
import { Direction, DirectionCollection, DirectionInstance } from "../core/Direction";
import { GameUtils } from "../core/GameUtils";
import { Hand } from "../core/Hand";
import { Player } from "../core/Player";
import { DoubleDummySolver } from "../core/search/DoubleDummySolver";
import { Trick } from "../core/Trick";

interface DealtHands {
  west: string[];
  north: string[];
  east: string[];
  south: string[];
  internal: Player[];
}

interface Contract {
  west: string[];
  north: string[];
  east: string[];
  south: string[];
  nextToPlay: DirectionInstance;
  northSouthContract: boolean;
  internal: Auctioneer;
}

interface RunningHand {
  plays: { direction: DirectionInstance, card: string }[]
  winner: DirectionInstance;
  northSouthWins: number;
  eastWestWins: number;
  internal: Deal;
}

const northSouthRules: ApiRules = {
  alwaysPlayWinnerOnLastTurn: true,
  neverTakeFromPartner: true,
  disableDuplicateRemoval: true,
  maxSearch: 150000,
  maxTricks: 3
};
const eastWestRules: ApiRules = {
  maxSearch: 150000,
  maxTricks: 3
};

declare global {
  function nodeRequire(module: string): any;
}

// const seedrandom = nodeRequire("seedrandom");

function deal(): DealtHands {
  const players: Player[] = [ 
    new Player(Direction.WEST), 
    new Player(Direction.NORTH), 
    new Player(Direction.EAST), 
    new Player(Direction.SOUTH)
  ];
  // GameUtils.initializeRandom(players, 13, seedrandom('sdqIjXhjX'));
  GameUtils.initializeRandom(players);
  return {
    west: new Hand(players[Direction.WEST].hand).getCardsHighToLow().map(c => c.getUniversal()),
    north: new Hand(players[Direction.NORTH].hand).getCardsHighToLow().map(c => c.getUniversal()),
    east: new Hand(players[Direction.EAST].hand).getCardsHighToLow().map(c => c.getUniversal()),
    south: new Hand(players[Direction.SOUTH].hand).getCardsHighToLow().map(c => c.getUniversal()),
    internal: players
  }
}

const nextApiDirection = {
  N: ApiDirection.East,
  E: ApiDirection.South,
  S: ApiDirection.West,
  W: ApiDirection.North
};

async function runBidAsync(initialDeal: DealtHands) {
  if (typeof window !== 'undefined') {
    const worker = new Worker('./bin/gnubridge-bidding.js');
    const dealtHands = { west: initialDeal.west, north: initialDeal.north, east: initialDeal.east, south: initialDeal.south, nextToPlay: ApiDirection.North } as any;
    const contract = {
      west: [], north: [], east: [], south: [], highestBid: '', passCount: -1
    } as any;
    while (contract.passCount < 3) {
      worker.postMessage({ dealtHands, contract });
      await new Promise(resolve => {
        worker.onmessage = e => {
          if (e.data === '-') contract.passCount++;
          else contract.passCount = 0;
          const direction = dealtHands.nextToPlay;
          contract[directionToKey[dealtHands.nextToPlay]].push(e.data);
          dealtHands.nextToPlay = nextApiDirection[dealtHands.nextToPlay];
          console.log(`Async bid ${DirectionCollection.fromUniversal(direction).toString()} ${e.data}`);
          resolve(undefined);
        };
      });
    }
  }
}

function runBidSync(initialDeal: DealtHands): Contract {
  const auctioneer = new Auctioneer(DirectionCollection.NORTH_INSTANCE);
  const biddingAgents: BiddingAgent[] = [
    new BiddingAgent(auctioneer, new Hand(initialDeal.internal[Direction.WEST].hand)),
    new BiddingAgent(auctioneer, new Hand(initialDeal.internal[Direction.NORTH].hand)),
    new BiddingAgent(auctioneer, new Hand(initialDeal.internal[Direction.EAST].hand)),
    new BiddingAgent(auctioneer, new Hand(initialDeal.internal[Direction.SOUTH].hand))
  ];

  for (let d = Direction.NORTH; !auctioneer.biddingFinished(); d = (d + 1) % 4) {
    auctioneer.bid(biddingAgents[d].getBid());
  }

  if (!auctioneer.getHighCall()) {
    console.log("The hand was passed out!");
    throw new Error("Hand passed out");
  }
  
  const highCallDirection = auctioneer.getHighCall().getDirection();
  
  return {
    west: auctioneer.getCalls()
      .filter(call => call.getDirection() === DirectionCollection.WEST_INSTANCE)
      .map(call => BidCollection.toUniversal(call.getBid())),
    north: auctioneer.getCalls()
      .filter(call => call.getDirection() === DirectionCollection.NORTH_INSTANCE)
      .map(call => BidCollection.toUniversal(call.getBid())),
    east: auctioneer.getCalls()
      .filter(call => call.getDirection() === DirectionCollection.EAST_INSTANCE)
      .map(call => BidCollection.toUniversal(call.getBid())),
    south: auctioneer.getCalls()
      .filter(call => call.getDirection() === DirectionCollection.SOUTH_INSTANCE)
      .map(call => BidCollection.toUniversal(call.getBid())),
    nextToPlay: highCallDirection.clockwise(),
    northSouthContract: highCallDirection.getValue() === Direction.NORTH || highCallDirection.getValue() === Direction.SOUTH,
    internal: auctioneer
  }
}

async function runTricksAsync(initialDeal: DealtHands, finalContract: Contract, storedTricks: RunningHand[]) {
  if (typeof window !== 'undefined') {
    const worker = new Worker('./bin/gnubridge-playing.js');
    const dealtHands = { west: initialDeal.west, pwest: [], north: initialDeal.north, pnorth: [], east: initialDeal.east, peast: [],
      south: initialDeal.south, psouth: [], northsouthwon: [], eastwestwon: [], playedCards: [],
      nextToPlay: DirectionCollection.toUniversalFromDirection(finalContract.nextToPlay.getValue()) } as any;
    const finalBid = finalContract.internal.getHighCall().getBid();
    const contract = {
      west: finalContract.west, north: finalContract.north, east: finalContract.east, south: finalContract.south,
      highestBid: BidCollection.toUniversal(finalBid), doubled: finalBid.isDoubled(), redoubled: finalBid.isRedoubled(),
      declarer: DirectionCollection.toUniversalFromDirection(finalContract.nextToPlay.getValue())
    } as any;
    let trick;
    for (let i = 0; i < 13 * 4; i++) {
      if (i % 4 === 0) {
        if (i / 4 >= 1) {
          const newDirection = storedTricks[i / 4 - 1].winner;
          dealtHands.nextToPlay = DirectionCollection.toUniversalFromDirection(newDirection.getValue());
          if (dealtHands.nextToPlay === 'N' || dealtHands.nextToPlay === 'S') dealtHands.northsouthwon.push(trick);
          else dealtHands.eastwestwon.push(trick);
          console.log(`Reset to direction ${newDirection}`);
        }
        trick = undefined;
      }
      const rules: ApiRules = (dealtHands.nextToPlay === 'N' || dealtHands.nextToPlay === 'S') ? northSouthRules : eastWestRules;
      worker.postMessage({ dealtHands, contract, currentTrick: trick, rules });
      await new Promise(resolve => {
        worker.onmessage = e => {
          if (!trick) trick = { order: [] };
          const direction = dealtHands.nextToPlay;
          trick[directionToKey[direction]] = e.data;
          trick.order.push(direction);
          dealtHands[directionToKey[direction]] = dealtHands[directionToKey[direction]].filter(x => x !== e.data);
          dealtHands[`p${directionToKey[direction]}`] = dealtHands[`p${directionToKey[direction]}`].concat([ e.data ]);
          dealtHands.playedCards = dealtHands.playedCards.concat([ e.data ]);
          dealtHands.nextToPlay = nextApiDirection[dealtHands.nextToPlay];
          console.log(`Async play ${DirectionCollection.fromUniversal(direction).toString()} ${e.data}`);
          resolve(undefined);
        };
      });
    }
  }
}

function runTrick(initialDeal: DealtHands, contract: Contract, game?: RunningHand): RunningHand {
  let deal: Deal;
  if (game) {
    deal = game.internal;
    deal.tricksPlayed = Math.floor(deal.playedCards.cards.length / 4);
  }
  else {
    deal = new Deal(contract.internal.getHighBid().trump);
    deal.setPlayer(Direction.WEST, initialDeal.internal[Direction.WEST]);
    deal.setPlayer(Direction.NORTH, initialDeal.internal[Direction.NORTH]);
    deal.setPlayer(Direction.EAST, initialDeal.internal[Direction.EAST]);
    deal.setPlayer(Direction.SOUTH, initialDeal.internal[Direction.SOUTH]);
    deal.setNextToPlay(contract.nextToPlay.getValue());
  }
  for (let i = 0; i < 4; i++) {
    const rules: ApiRules = (deal.nextToPlay === Direction.NORTH || deal.nextToPlay === Direction.SOUTH) ? northSouthRules : eastWestRules;
    const solver = new DoubleDummySolver(deal, null, rules, { highestBid: BidCollection.toUniversal(contract.internal.getHighBid()), declarer: contract.internal.getDummy().opposite().toString()[0], dummy: contract.internal.getDummy().toString()[0] } as any);
    solver.search();
    const bestCard = solver.getBestMoves()[0];
    deal.play(bestCard);
  }
  const trick: Trick = deal.getPreviousTrick();
  const winner = trick.whoPlayed(trick.getHighestCard()).getDirection();
  const northSouthWins = game ? game.northSouthWins : 0;
  const eastWestWins = game ? game.eastWestWins : 0;
  deal.setNextToPlay(winner);
  return {
    plays: trick.getCards().map(c => ({ direction: DirectionCollection.instance(trick.whoPlayed(c).getDirection()), card: c.getUniversal() })),
    winner: DirectionCollection.instance(winner),
    northSouthWins: (winner === Direction.NORTH || winner === Direction.SOUTH) ? northSouthWins + 1 : northSouthWins,
    eastWestWins: (winner === Direction.EAST || winner === Direction.WEST) ? eastWestWins + 1 : eastWestWins,
    internal: deal
  };
}

const storedTricks: RunningHand[] = [];
const initialDeal = deal();
const contract = runBidSync(initialDeal);

console.log("Ignore engine output above following line");
console.log("---");
JSON.stringify(northSouthRules, null, "\t").split("\n").map(x => console.log(x));
console.log("---");
console.log("");

console.log("North: ".padEnd(8) + initialDeal.north.map(x => x.padEnd(3)).join(", "));
console.log("East: ".padEnd(8) + initialDeal.east.map(x => x.padEnd(3)).join(", "));
console.log("South: ".padEnd(8) + initialDeal.south.map(x => x.padEnd(3)).join(", "));
console.log("West: ".padEnd(8) + initialDeal.west.map(x => x.padEnd(3)).join(", "));
console.log("");
console.log("North commences the bidding...");
console.log("");
console.log("North: ".padEnd(8) + contract.north.map(x => x.padEnd(3)).join(", "));
console.log("East: ".padEnd(8) + contract.east.map(x => x.padEnd(3)).join(", "));
console.log("South: ".padEnd(8) + contract.south.map(x => x.padEnd(3)).join(", "));
console.log("West: ".padEnd(8) + contract.west.map(x => x.padEnd(3)).join(", "));
console.log("");
console.log(`${contract.nextToPlay} commences play...`);
console.log("");
let game;
for (let i = 0; i < 13; i++) {
  const trick = runTrick(initialDeal, contract, game);
  trick.plays.forEach(p => console.log(`${p.card.padEnd(3)} played by ${p.direction}`));
  console.log("");
  console.log(`Trick won by ${trick.winner}`);
  console.log("");
  storedTricks.push(trick);
  game = trick;
}

if (contract.northSouthContract) {
  if (game.northSouthWins >= contract.internal.getHighCall().getBid().value + 6)
    console.log(`N/S met their contract ${game.northSouthWins} tricks to ${game.eastWestWins}`);
  else
    console.log(`N/S failed meet their contract ${game.northSouthWins} tricks to ${game.eastWestWins}`);
}
else {
  if (game.eastWestWins >= contract.internal.getHighCall().getBid().value + 6)
    console.log(`E/W met their contract ${game.eastWestWins} tricks to ${game.northSouthWins}`);
  else
    console.log(`E/W failed meet their contract ${game.eastWestWins} tricks to ${game.northSouthWins}`);
}

if (typeof window !== 'undefined') {
  console.log("The game will now attempt to replay using Web Workers (browser only)");
  console.log("You may need to launch Chrome with --allow-file-access-from-files");
  runBidAsync(initialDeal).then(() => {
    runTricksAsync(initialDeal, contract, storedTricks);
  });
}
