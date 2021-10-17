# gnubidder-ts

#### By Pawel Slusarz, Alexander Misel and Mark Pazolli

A TypeScript port of Alexander Misel's enhanced [GNUBridge](https://github.com/AlexanderMisel/gnubridge)
bidder.

Although called **gnubidder-ts** it does actually include the playing
code as well. Regrettably contains many frustrating anti-patterns from
Java-to-TypeScript machine-generated code.

With special thanks to  datathings's [java2typescript](https://github.com/datathings/java2typescript)
and Vu Nguyen's [min-require](https://github.com/ng-vu/min-require).

## Testing

To run tests:

```
npm install
npm test
```

## Running

To run a "complete" game (takes around 20 seconds):

```
npm install
npm start
```

## Why this exists...

Alexander has built a really solid bid agent for GNUBridge. The agent behaves
in the way you would expect a bridge bidding agent to behave. Following
conventions and behaviours that will be familiar to experienced bridge 
players. I tried to replicate those for my project Free Bridge. But not only
was that difficult, it began to feel it couldn't easily be done in a way that
was not a straight derivative work.

Instead I produced my own bidding agent starting from scatch that ignored
conventions and tended to bid almost always in the suit that was the player's
strongest. This is [essence-bidder](https://github.com/markmehere/essence-bidder).
It too is open source but not under the GPL.

## Will Free Bridge be open source?

Free Bridge is not currently open source. But I expect in time it may become
open source. There are many wonderful open source bridge clients that became
free as their owners opened up to idea including the original [GNUBridge](https://github.com/pslusarz/gnubridge)
and Steven Han's [Easy Bridge](http://stevenhan.com/Old/EasyBridgeSource0.htm).

## Should I make my own bidding agent using this?

You definitely can! But I wouldn't...

Although I ultimately failed to build a bidding agent like Alexander's
for Free Bridge, it was not due to the lack of power of ES6. I felt
writing in ES6 made things much easier than writing in Java-like
TypeScript code. As such I would suggest any substantial effort 
be based upon [essence-bidder](https://github.com/markmehere/essence-bidder).
Doing so, you'll benefit from a more liberal licence and concise efficient
code that doesn't look like Java ported to TypeScript.

## How can I use my custom bidding agent with Free Bridge?

The bridge assistant in the game (see the light bulb in the bottom right)
should offer you some tips.

## Use Web Workers

The Web Workers provide on-demand bidding and play advice. This is done through
two files `bin/gnubridge-bidding.js` and `bin/gnubridge-playing.js`. To build
and run them:

```
npm install
npm run make-all
google-chrome --allow-file-access-from-files example.html # linux
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --allow-file-access-from-files example.html # mac os x
start chrome --allow-file-access-from-files # windows line 1
start chrome file:///C:/gnubidder-ts/example.html #windows line 2
```

To use Web Workers follow the code in `example.html` and `src/cli/main.ts`.

```
let dealtHands = {
  west: ['7S','6S','KH','JH','9H','4H','QD','10D','6D','2D','10C','7C','6C'],
  north: ['AS','KS','QS','10S','8S','4S','3S','AH','6H','5H','KC','JC','3C'],
  east: ['JS','2S','QH','8H','KD','8D','7D','4D','3D','9C','8C','5C','4C'],
  south: ['9S','5S','10H','7H','3H','2H','AD','JD','9D','5D','AC','QC','2C'],
  nextToPlay: 'N'
};
document.getElementById('board').innerHTML = JSON.stringify(dealtHands);
const bidWorker = new Worker('./bin/gnubridge-bidding.js');
const playerWorker = new Worker('./bin/gnubridge-playing.js');
bidWorker.postMessage({ dealtHands });
bidWorker.onmessage = e => {
  document.getElementById('bidding').innerHTML = `In this case North would bid: ${e.data}`;
  const playerWorker = new Worker('./bin/gnubridge-playing.js');
  const contract = { highestBid: '1S' };
  dealtHands = { ...dealtHands, pwest: [], pnorth: [], peast: [], psouth: [], playedCards: [], nextToPlay: 'E' };
  playerWorker.postMessage({ dealtHands, contract });
  playerWorker.onmessage = e => {
    document.getElementById('playing').innerHTML = `And on a 1S contract East would open with: ${e.data}`;
  };
};
```

## Allowed use

This code is distributed under the terms of the GNU General Public License v3.0.

I cannot provide legal advice nor speak to the will of the other authors of this
code.

However, as far as I (Mark Pazolli) am concerned, you can use the workers in
a web app or application as long as you make the source code to the workers
and any modifications available under the terms of the GNU General Public
License v3.0.

Provided your web app or application is not a derived work (i.e. does not
copy the worker's methods nor compile the worker's code into your minified
distributed JavaScript file), I *personally* do not require you to
make the whole web app or application's source code available under the terms
of the GNU General Public License v3.0. The `example.html` provides an example
of how you might interact with the workers in, what I believe to be, a
non-derivative work.

I stress that you must provide access to your modifications of the workers per
the terms of the GPLv3 license. Though your choice to minify/obsfucate the
code has little impact on your obligations under the GPLv3 license, my preference
would be for you to distribute the work unminified as is currently produced by
`npm run make-all`. If you require an ES3 version (wider browser compatibility)
simply modify the `target` of `tsconfig-bidding.json` and `tsconfig-playing.json`.

You will also find unminified versions substantially easier to debug.

Free Bridge attempts to draw an even sharper distinction between itself and
this bidding agent. Offering an alternative bidding agent, Essence, and only
downloading this GPL'd bidding agent to the user's computer after installation.

## License

Copyright (c) 2020 Mark Pazolli
Copyright (c) 2014-2015 Alexander Misel
Copyright (c) 2009-2013 Pawel Slusarz

Distributed under the terms of the GNU General Public License v3.0
