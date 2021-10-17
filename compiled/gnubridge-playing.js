/* gnubidder-ts 0.8.0 - A TypeScript port of gnubridge */
/*
  The following license only applies to min-require (roughly next 90 lines)
  the rest is GPLv3 and I can't relicense it.

  Copyright (c) 2014 Vu Nguyen <ng-vu@liti.ws>

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/
(function (context) {
  var modules,
    funcs,
    stack;

  function reset() {
    modules = {};
    funcs = {};
    stack = [];
  }

  // define(id, function(require, module, exports))
  // or
  // define(id, [dep1, ...], function (module1, ...))
  function define(id, deps, callback) {
    if (typeof id !== 'string' || id === '') throw new Error('invalid module id ' + id);
    if (funcs[id]) throw new Error('duplicated module id ' + id);
    if (typeof deps === 'function') {
      funcs[id] = deps; // callback
      return;
    } 

    if (typeof callback !== 'function') throw new Error('invalid module function');

    funcs[id] = function (require, module, exports) {
      return callback.apply(this, deps.map(function (dep) {
        if (dep === 'exports') return exports;
        if (dep === 'require') return require;
        return require(dep);
      }));
    }
  }

  define.amd = {};

  function stubRequire(stub) {
    return function (id) {
        if (!stub.hasOwnProperty(id)) {
          throw new Error('Stub ' + id + ' not found!');
        } else {
          return stub[id];
        }
    };
  }

  // require(id, stub)
  function require(id, stub) {
    var m;
    if (!funcs[id]) throw new Error('module ' + id + ' is not defined');
    if (stub) {
      m = { id: id, exports: {} };
      m.exports = funcs[id](stubRequire(stub), m, m.exports) || m.exports;
      return m.exports;
    }
    if (modules[id]) return modules[id].exports;

    stack.push(id);
    m = modules[id] = { id: id, exports: {} };
    m.exports = funcs[id](require, m, m.exports) || m.exports;
    stack.pop();

    return m.exports;
  }

  reset();
  context.define = define;
  context.requireAndRun = require;
  context.reset = reset;
})(typeof window !== 'undefined' ? window : (typeof global === 'object' ? global : this));
/* END MIT LICENSE */

/**
  GNU GENERAL PUBLIC LICENSE
  Version 3, 29 June 2007

  Copyright (c) 2020 Mark Pazolli
  Copyright (c) 2014-2015 Alexander Misel
  Copyright (c) 2009-2013 Pawel Slusarz
*/


var nodeRequire = (typeof require !== 'undefined') ? require : (x) => (x === 'seedrandom') ? seedrandom : undefined;

define("core/Direction", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DirectionCollection = exports.DirectionInstance = exports.Direction = void 0;
    var Direction;
    (function (Direction) {
        Direction[Direction["WEST"] = 0] = "WEST";
        Direction[Direction["NORTH"] = 1] = "NORTH";
        Direction[Direction["EAST"] = 2] = "EAST";
        Direction[Direction["SOUTH"] = 3] = "SOUTH";
    })(Direction = exports.Direction || (exports.Direction = {}));
    class DirectionInstance {
        constructor(value, readable, collection) {
            this.value = value;
            this.readable = readable;
            this.collection = collection;
        }
        toString() {
            return this.readable;
        }
        getValue() {
            return this.value;
        }
        clockwise() {
            return this.collection.clockwise(this.value, 1);
        }
        opposite() {
            return this.collection.clockwise(this.value, 2);
        }
        equals(other) {
            return this.value === other.value;
        }
    }
    exports.DirectionInstance = DirectionInstance;
    class DirectionCollection {
        static instance(direction) {
            return DirectionCollection.ORDERED[direction] || null;
        }
        static toUniversalFromDirection(value) {
            switch (value) {
                case Direction.WEST:
                    return 'W';
                case Direction.NORTH:
                    return 'N';
                case Direction.EAST:
                    return 'E';
                case Direction.SOUTH:
                    return 'S';
            }
        }
        static fromUniversal(value) {
            switch (value) {
                case 'W':
                    return this.WEST_INSTANCE;
                case 'N':
                    return this.NORTH_INSTANCE;
                case 'E':
                    return this.EAST_INSTANCE;
                case 'S':
                    return this.SOUTH_INSTANCE;
            }
            throw new Error(`Unable to translate direction: ${value}`);
        }
        static clockwise(value, amount) {
            return DirectionCollection.ORDERED[(value + amount) % DirectionCollection.ORDERED.length];
        }
    }
    exports.DirectionCollection = DirectionCollection;
    DirectionCollection.WEST_INSTANCE = new DirectionInstance(Direction.WEST, "West", DirectionCollection);
    DirectionCollection.NORTH_INSTANCE = new DirectionInstance(Direction.NORTH, "North", DirectionCollection);
    DirectionCollection.EAST_INSTANCE = new DirectionInstance(Direction.EAST, "East", DirectionCollection);
    DirectionCollection.SOUTH_INSTANCE = new DirectionInstance(Direction.SOUTH, "South", DirectionCollection);
    DirectionCollection.ORDERED = [DirectionCollection.WEST_INSTANCE, DirectionCollection.NORTH_INSTANCE, DirectionCollection.EAST_INSTANCE, DirectionCollection.SOUTH_INSTANCE];
});
/* This file only under CC0 - public domain */
define("api/interfaces", ["require", "exports", "core/Direction"], function (require, exports, Direction_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiDirection = exports.keyToGnubridgeDirection = exports.directionToKey = void 0;
    exports.directionToKey = {
        N: 'north',
        E: 'east',
        S: 'south',
        W: 'west'
    };
    exports.keyToGnubridgeDirection = {
        'north': Direction_1.Direction.NORTH,
        'east': Direction_1.Direction.EAST,
        'south': Direction_1.Direction.SOUTH,
        'west': Direction_1.Direction.WEST
    };
    var ApiDirection;
    (function (ApiDirection) {
        ApiDirection["North"] = "N";
        ApiDirection["East"] = "E";
        ApiDirection["South"] = "S";
        ApiDirection["West"] = "W";
    })(ApiDirection = exports.ApiDirection || (exports.ApiDirection = {}));
});
/* End CC0 */
define("core/deck/Trump", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Trump = void 0;
    class Trump {
        isMajorSuit() {
            return false;
        }
        isMinorSuit() {
            return false;
        }
        isSuit() {
            return false;
        }
        isNoTrump() {
            return false;
        }
    }
    exports.Trump = Trump;
});
define("core/deck/Suit", ["require", "exports", "core/deck/Trump"], function (require, exports, Trump_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Suit = void 0;
    class Suit extends Trump_1.Trump {
        constructor() {
            super(...arguments);
            this.index = -1;
        }
        isLowerRankThan(other) {
            if (!other.isSuit()) {
                return false;
            }
            return this.index < other.index;
        }
        isSuit() {
            return true;
        }
        isMinorSuit() {
            return false;
        }
        isMajorSuit() {
            return false;
        }
        isNoTrump() {
            return false;
        }
    }
    exports.Suit = Suit;
});
define("core/deck/CardValues", ["require", "exports", "core/Card"], function (require, exports, Card_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Two = exports.Three = exports.Four = exports.Five = exports.Six = exports.Seven = exports.Eight = exports.Nine = exports.Ten = exports.Jack = exports.Queen = exports.King = exports.Ace = void 0;
    const secret = "shouldnotconstructotherthanCardValues.ts";
    class Ace {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("A", denomination, secret);
            }
            return this.instances[denomination.index];
        }
        static isValueOf(card) {
            return card.value == Card_1.Card.strToIntValue("A");
        }
    }
    exports.Ace = Ace;
    Ace.instances = [];
    class King {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("K", denomination, secret);
            }
            return this.instances[denomination.index];
        }
        static isValueOf(card) {
            return card.value == Card_1.Card.strToIntValue("K");
        }
    }
    exports.King = King;
    King.instances = [];
    class Queen {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("Q", denomination, secret);
            }
            return this.instances[denomination.index];
        }
        static isValueOf(card) {
            return card.value == Card_1.Card.strToIntValue("Q");
        }
    }
    exports.Queen = Queen;
    Queen.instances = [];
    class Jack {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("J", denomination, secret);
            }
            return this.instances[denomination.index];
        }
        static isValueOf(card) {
            return card.value == Card_1.Card.strToIntValue("J");
        }
    }
    exports.Jack = Jack;
    Jack.instances = [];
    class Ten {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("10", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Ten = Ten;
    Ten.instances = [];
    class Nine {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("9", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Nine = Nine;
    Nine.instances = [];
    class Eight {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("8", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Eight = Eight;
    Eight.instances = [];
    class Seven {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("7", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Seven = Seven;
    Seven.instances = [];
    class Six {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("6", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Six = Six;
    Six.instances = [];
    class Five {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("5", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Five = Five;
    Five.instances = [];
    class Four {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("4", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Four = Four;
    Four.instances = [];
    class Three {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("3", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Three = Three;
    Three.instances = [];
    class Two {
        static of(denomination) {
            if (!this.instances[denomination.index]) {
                this.instances[denomination.index] = new Card_1.Card("2", denomination, secret);
            }
            return this.instances[denomination.index];
        }
    }
    exports.Two = Two;
    Two.instances = [];
});
define("core/deck/NoTrump", ["require", "exports", "core/deck/Trump"], function (require, exports, Trump_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoTrump = exports.NoTrumpClass = void 0;
    class NoTrumpClass extends Trump_2.Trump {
        constructor() {
            super(...arguments);
            this.index = -1;
        }
        toString() {
            return "NOTRUMP";
        }
        toDebugString() {
            return "NoTrump.i()";
        }
        isNoTrump() {
            return true;
        }
    }
    exports.NoTrumpClass = NoTrumpClass;
    exports.NoTrump = new NoTrumpClass();
});
define("core/deck/SuitValues", ["require", "exports", "core/deck/Suit"], function (require, exports, Suit_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Diamonds = exports.Clubs = exports.Hearts = exports.Spades = exports.DiamondsClass = exports.ClubsClass = void 0;
    class HeartsClass extends Suit_1.Suit {
        constructor() {
            super(...arguments);
            this.index = 2;
        }
        isMajorSuit() {
            return true;
        }
        toString() {
            return "HEARTS";
        }
        toDebugString() {
            return "Hearts.i()";
        }
    }
    class SpadesClass extends Suit_1.Suit {
        constructor() {
            super(...arguments);
            this.index = 3;
        }
        isMajorSuit() {
            return true;
        }
        toString() {
            return "SPADES";
        }
        toDebugString() {
            return "Spades.i()";
        }
    }
    class ClubsClass extends Suit_1.Suit {
        constructor() {
            super(...arguments);
            this.index = 0;
        }
        toString() {
            return "CLUBS";
        }
        isMinorSuit() {
            return true;
        }
        toDebugString() {
            return "Clubs.i()";
        }
    }
    exports.ClubsClass = ClubsClass;
    class DiamondsClass extends Suit_1.Suit {
        constructor() {
            super(...arguments);
            this.index = 1;
        }
        toString() {
            return "DIAMONDS";
        }
        isMinorSuit() {
            return true;
        }
        toDebugString() {
            return "Diamonds.i()";
        }
    }
    exports.DiamondsClass = DiamondsClass;
    exports.Spades = new SpadesClass();
    exports.Hearts = new HeartsClass();
    exports.Clubs = new ClubsClass();
    exports.Diamonds = new DiamondsClass();
});
define("core/deck/SuitCollection", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitValues"], function (require, exports, NoTrump_1, SuitValues_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuitCollection = void 0;
    class SuitCollection {
        static getIndex(denomination) {
            return SuitCollection.reverseList.findIndex((x) => x === denomination);
        }
        static toUniversal(suit) {
            if (suit === NoTrump_1.NoTrump)
                return 'NT';
            if (suit === SuitValues_1.Spades)
                return 'S';
            if (suit === SuitValues_1.Hearts)
                return 'H';
            if (suit === SuitValues_1.Diamonds)
                return 'D';
            if (suit === SuitValues_1.Clubs)
                return 'C';
            throw new Error("Unrecognized suit");
        }
        static get(s) {
            if ("S" === s) {
                return SuitValues_1.Spades;
            }
            else if ("H" === s) {
                return SuitValues_1.Hearts;
            }
            else if ("D" === s) {
                return SuitValues_1.Diamonds;
            }
            else if ("C" === s) {
                return SuitValues_1.Clubs;
            }
            else {
                throw new Error(`do not know how to translate string '${s}' to a suit (need one of: S,H,D,C)`);
            }
        }
    }
    exports.SuitCollection = SuitCollection;
    SuitCollection.list = [SuitValues_1.Spades, SuitValues_1.Hearts, SuitValues_1.Diamonds, SuitValues_1.Clubs];
    SuitCollection.reverseList = [SuitValues_1.Clubs, SuitValues_1.Diamonds, SuitValues_1.Hearts, SuitValues_1.Spades];
    SuitCollection.mmList = [SuitValues_1.Hearts, SuitValues_1.Spades, SuitValues_1.Clubs, SuitValues_1.Diamonds];
});
define("core/Card", ["require", "exports", "core/deck/CardValues", "core/deck/SuitCollection", "core/deck/SuitValues"], function (require, exports, CardValues_1, SuitCollection_1, SuitValues_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Card = void 0;
    const do_not_use_outside = "shouldnotconstructotherthanCardValues.ts";
    class Card {
        constructor(value, d, secret) {
            if (secret !== do_not_use_outside) {
                throw new Error("Assert failure: Card constructed without secret");
            }
            this.value = (typeof value === 'number') ? value : Card.strToIntValue(value);
            this.denomination = d;
            this.debug = this.getUniversal();
        }
        static strToIntValue(value) {
            if ("2" === value) {
                return Card.TWO;
            }
            else if ("3" === value) {
                return Card.THREE;
            }
            else if ("4" === value) {
                return Card.FOUR;
            }
            else if ("5" === value) {
                return Card.FIVE;
            }
            else if ("6" === value) {
                return Card.SIX;
            }
            else if ("7" === value) {
                return Card.SEVEN;
            }
            else if ("8" === value) {
                return Card.EIGHT;
            }
            else if ("9" === value) {
                return Card.NINE;
            }
            else if ("10" === value) {
                return Card.TEN;
            }
            else if ("J" === value.toUpperCase()) {
                return Card.JACK;
            }
            else if ("Q" === value.toUpperCase()) {
                return Card.QUEEN;
            }
            else if ("K" === value.toUpperCase()) {
                return Card.KING;
            }
            else if ("A" === value.toUpperCase()) {
                return Card.ACE;
            }
            else {
                throw new Error("'" + value + "' is not a valid card value");
            }
        }
        toString() {
            return Card.valueToString(this.value) + " of " + this.denomination;
        }
        static valueToString(i) {
            switch (i) {
                case Card.TWO:
                    return "2";
                case Card.THREE:
                    return "3";
                case Card.FOUR:
                    return "4";
                case Card.FIVE:
                    return "5";
                case Card.SIX:
                    return "6";
                case Card.SEVEN:
                    return "7";
                case Card.EIGHT:
                    return "8";
                case Card.NINE:
                    return "9";
                case Card.TEN:
                    return "10";
                case Card.JACK:
                    return "J";
                case Card.QUEEN:
                    return "Q";
                case Card.KING:
                    return "K";
                case Card.ACE:
                    return "A";
            }
            return null;
        }
        trumps(other, trump) {
            return this.denomination === trump && other.denomination !== trump;
        }
        hasSameColorAs(other) {
            return this.denomination === other.denomination;
        }
        hasGreaterValueThan(other) {
            return this.value > other.value;
        }
        beats(other, trump, ifDifferingSuit) {
            if (this.denomination === trump && other.denomination !== trump)
                return true; /* if we're trump we always beat the other */
            if (other.denomination === trump && this.denomination !== trump)
                return false; /* if the the other is trump it always beats us */
            if (this.denomination === trump && other.denomination === trump)
                return this.value > other.value; /* if both are trumps it comes down to value */
            if (this.denomination === other.denomination)
                return this.value > other.value; /* if both are the same suit it comes down to value */
            return ifDifferingSuit; /* if both are differing suits it's unclear */
        }
        getIndex() {
            return this.value + SuitCollection_1.SuitCollection.getIndex(this.denomination) * (Card.ACE + 1);
        }
        getUniversal() {
            if (this.denomination === SuitValues_2.Spades) {
                return Card.valueToString(this.value) + "S";
            }
            else if (this.denomination === SuitValues_2.Hearts) {
                return Card.valueToString(this.value) + "H";
            }
            else if (this.denomination === SuitValues_2.Diamonds) {
                return Card.valueToString(this.value) + "D";
            }
            else if (this.denomination === SuitValues_2.Clubs) {
                return Card.valueToString(this.value) + "C";
            }
            throw new Error("Unable to translate card");
        }
        toDebugString() {
            let result = "";
            switch (this.value) {
                case Card.TWO:
                    result = "Two";
                    break;
                case Card.THREE:
                    result = "Three";
                    break;
                case Card.FOUR:
                    result = "Four";
                    break;
                case Card.FIVE:
                    result = "Five";
                    break;
                case Card.SIX:
                    result = "Six";
                    break;
                case Card.SEVEN:
                    result = "Seven";
                    break;
                case Card.EIGHT:
                    result = "Eight";
                    break;
                case Card.NINE:
                    result = "Nine";
                    break;
                case Card.TEN:
                    result = "Ten";
                    break;
                case Card.JACK:
                    result = "Jack";
                    break;
                case Card.QUEEN:
                    result = "Queen";
                    break;
                case Card.KING:
                    result = "King";
                    break;
                case Card.ACE:
                    result = "Ace";
                    break;
            }
            result += ".of(" + this.denomination.toDebugString() + ")";
            return result;
        }
        static getFromValues(nomination, suit) {
            if ("2" === nomination) {
                return CardValues_1.Two.of(suit);
            }
            else if ("3" === nomination) {
                return CardValues_1.Three.of(suit);
            }
            else if ("4" === nomination) {
                return CardValues_1.Four.of(suit);
            }
            else if ("5" === nomination) {
                return CardValues_1.Five.of(suit);
            }
            else if ("6" === nomination) {
                return CardValues_1.Six.of(suit);
            }
            else if ("7" === nomination) {
                return CardValues_1.Seven.of(suit);
            }
            else if ("8" === nomination) {
                return CardValues_1.Eight.of(suit);
            }
            else if ("9" === nomination) {
                return CardValues_1.Nine.of(suit);
            }
            else if ("T" === nomination || "10" === nomination) {
                return CardValues_1.Ten.of(suit);
            }
            else if ("J" === nomination) {
                return CardValues_1.Jack.of(suit);
            }
            else if ("Q" === nomination) {
                return CardValues_1.Queen.of(suit);
            }
            else if ("K" === nomination) {
                return CardValues_1.King.of(suit);
            }
            else if ("A" === nomination) {
                return CardValues_1.Ace.of(suit);
            }
            else {
                throw new Error(`do not know how to make card of denomination: ${nomination} (needs to be one of: 2,3,....9,T,J,Q,K,A)`);
            }
        }
        static get(icard) {
            const card = icard.replace('10', 'T');
            const suit = SuitCollection_1.SuitCollection.get(card.toUpperCase().substring(1, 2));
            const nomination = card.toUpperCase().substring(0, 1);
            return this.getFromValues(nomination, suit);
        }
    }
    exports.Card = Card;
    Card.TWO = 0;
    Card.THREE = 1;
    Card.FOUR = 2;
    Card.FIVE = 3;
    Card.SIX = 4;
    Card.SEVEN = 5;
    Card.EIGHT = 6;
    Card.NINE = 7;
    Card.TEN = 8;
    Card.JACK = 9;
    Card.QUEEN = 10;
    Card.KING = 11;
    Card.ACE = 12;
    Card.FullSuit = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    Card.COUNT = 52;
});
define("core/Hand", ["require", "exports", "core/Card", "core/deck/SuitCollection"], function (require, exports, Card_2, SuitCollection_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Hand = void 0;
    class Hand {
        constructor(cards) {
            this.cards = cards ? cards.slice() : [];
        }
        static createCards(colorSuit, color) {
            if (!colorSuit.trim())
                return [];
            return colorSuit.split(",").map(ct => Card_2.Card.getFromValues(ct, color));
        }
        static fromSuits(...colorSuits) {
            return new Hand(colorSuits.reduce((acc, colorSuitStr, i) => acc.concat(this.createCards(colorSuitStr, SuitCollection_2.SuitCollection.list[i])), []));
        }
        add(c) {
            this.cards.push(c);
            this.orderedCards = null;
            if (c.denomination === this.color) {
                this.colorInOrder = null;
            }
        }
        getSuitHi2Low(suit) {
            if (suit === this.color && this.colorInOrder != null) {
                return this.colorInOrder;
            }
            const result = this.cards
                .filter(c => c.denomination === suit)
                .sort((a, b) => a.hasGreaterValueThan(b) ? -1 : 1);
            this.color = suit;
            this.colorInOrder = result;
            return result;
        }
        getSuitLength(suit) {
            return this.cards.filter(c => c.denomination === suit).length;
        }
        getCardsHighToLow() {
            if (this.orderedCards != null) {
                return this.orderedCards.slice();
            }
            const orderedCards = SuitCollection_2.SuitCollection.list.reduce((acc, color) => {
                return acc.concat(this.getSuitHi2Low(color));
            }, []);
            this.orderedCards = orderedCards;
            return orderedCards.slice();
        }
        getLongestSuit() {
            let longest = 0;
            let result = null;
            SuitCollection_2.SuitCollection.list.forEach((suit) => {
                const curLength = this.getSuitLength(suit);
                if (longest < curLength) {
                    longest = curLength;
                    result = suit;
                }
            });
            return result;
        }
        getLongestColorLength() {
            return SuitCollection_2.SuitCollection.list.reduce((acc, color) => Math.max(acc, this.getSuitLength(color)), 0);
        }
        contains(card) {
            if (this.cards.length === 0 && card == null) {
                return true;
            }
            else {
                return (this.cards.indexOf(card) > -1);
            }
        }
        isEmpty() {
            return this.cards.length === 0;
        }
        matchesSuitLengthsLongToShort(suitLength1, suitLength2, suitLength3, suitLength4) {
            const suitLengths = SuitCollection_2.SuitCollection.list.map(color => this.getSuitLength(color));
            suitLengths.sort();
            suitLengths.reverse();
            if (suitLengths[0] == suitLength1 && suitLengths[1] == suitLength2 && suitLengths[2] == suitLength3 && suitLengths[3] == suitLength4) {
                return true;
            }
            else {
                return false;
            }
        }
        getSuitsWithAtLeastCards(minimumSuitLength) {
            // What is mmList?
            return SuitCollection_2.SuitCollection.mmList.filter((suit) => this.getSuitLength(suit) >= minimumSuitLength);
        }
        getSuitsWithCardCount(suitLength) {
            return SuitCollection_2.SuitCollection.list.filter((suit) => this.getSuitLength(suit) === suitLength);
        }
        getGood5LengthSuits() {
            return SuitCollection_2.SuitCollection.list.filter(suit => this.isGood5LengthSuits(suit));
        }
        isGood5LengthSuits(suit) {
            const cardsInSuit = this.getSuitHi2Low(suit);
            return cardsInSuit.length >= 5 && (this.isAtLeastAQJXX(cardsInSuit) || this.isAtLeastKQTXX(cardsInSuit));
        }
        getDecent5LengthSuits() {
            return SuitCollection_2.SuitCollection.list.filter(s => this.isDecent5LengthSuits(s));
        }
        isDecent5LengthSuits(suit) {
            const cardsInSuit = this.getSuitHi2Low(suit);
            return this.getSuitLength(suit) >= 5 && this.isAtLeastQJXXX(cardsInSuit);
        }
        isAtLeastQJXXX(fiveCards) {
            if (fiveCards[0].value >= Card_2.Card.QUEEN && fiveCards[1].value >= Card_2.Card.JACK) {
                return true;
            }
            return false;
        }
        isAtLeastKQTXX(fiveCards) {
            if (fiveCards[0].value >= Card_2.Card.KING && fiveCards[1].value >= Card_2.Card.QUEEN && fiveCards[2].value >= Card_2.Card.TEN) {
                return true;
            }
            return false;
        }
        isAtLeastAQJXX(fiveCards) {
            if (fiveCards[0].value >= Card_2.Card.ACE && fiveCards[1].value >= Card_2.Card.QUEEN && fiveCards[2].value >= Card_2.Card.JACK) {
                return true;
            }
            return false;
        }
        haveStopper(suit) {
            const cardsInSuit = this.getSuitHi2Low(suit);
            if (cardsInSuit.length > 0 && cardsInSuit[0].value == Card_2.Card.ACE) {
                return true;
            }
            if (cardsInSuit.length > 1 && cardsInSuit[0].value == Card_2.Card.KING) {
                return true;
            }
            if (cardsInSuit.length > 2 && cardsInSuit[0].value == Card_2.Card.QUEEN) {
                return true;
            }
            if (cardsInSuit.length > 3 && cardsInSuit[0].value == Card_2.Card.JACK) {
                return true;
            }
            return false;
        }
        haveStrongStopper(suit) {
            const cardsInSuit = this.getSuitHi2Low(suit);
            const size = cardsInSuit.length;
            if (size < 2) {
                return false;
            }
            else if (size <= 3) {
                if (cardsInSuit[0].value != Card_2.Card.ACE && cardsInSuit[0].value != Card_2.Card.KING) {
                    return false;
                }
            }
            else {
                let bigThree = 0, bigFive = 0;
                for (let i = 0; i < size; ++i) {
                    const value = this.cards[i].value;
                    if (value >= Card_2.Card.QUEEN) {
                        bigThree++;
                    }
                    if (value >= Card_2.Card.TEN) {
                        bigFive++;
                    }
                }
                if (bigThree < 2 && bigFive < 3) {
                    return false;
                }
            }
            return true;
        }
        AisStronger(A, B) {
            return (B == null || this.getSuitLength(A) > this.getSuitLength(B));
        }
    }
    exports.Hand = Hand;
});
define("core/Trick", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Trick = void 0;
    class Trick {
        constructor(trump) {
            this.cards = [];
            this.players = [];
            this.trump = trump;
            this.trickNo = -1;
        }
        duplicate() {
            const result = new Trick(this.getTrump());
            result.cards = this.cards.slice();
            result.players = this.players.slice();
            return result;
        }
        addCard(card, p) {
            if (!p)
                throw new Error('No player');
            this.cards.push(card);
            this.players.push(p);
        }
        isStart() {
            return this.cards.length === 0;
        }
        isDone() {
            return this.cards.length === 4;
        }
        getHighestCard() {
            const overall = this.cards.reduce((highest, card) => {
                if (highest == null) {
                    return card;
                }
                else if (card.trumps(highest, this.trump)) {
                    return card;
                }
                else if (card.hasSameColorAs(highest) && card.hasGreaterValueThan(highest)) {
                    return card;
                }
                return highest;
            }, null);
            return overall;
        }
        setTrump(trump) {
            this.trump = trump;
        }
        getDenomination() {
            if (this.cards.length > 0) {
                return this.cards[0].denomination;
            }
            else {
                return null;
            }
        }
        getTrump() {
            return this.trump;
        }
        toString() {
            return `[${this.cards.map(c => c.toString()).join(', ')}]`;
        }
        getCards() {
            return this.cards.slice();
        }
        getCardsPlayed() {
            return this.cards.length;
        }
        cardPlayedBy(d) {
            const index = this.players.findIndex(p => p.getDirection() === d);
            return (index > -1) ? this.cards[index] : null;
        }
        whoPlayed(card) {
            return this.players[this.cards.indexOf(card)];
        }
    }
    exports.Trick = Trick;
});
define("core/Player", ["require", "exports", "core/Card", "core/deck/SuitCollection", "core/Direction", "core/Hand"], function (require, exports, Card_3, SuitCollection_3, Direction_2, Hand_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Player = exports.PlayerPair = void 0;
    var PlayerPair;
    (function (PlayerPair) {
        PlayerPair[PlayerPair["WEST_EAST"] = 0] = "WEST_EAST";
        PlayerPair[PlayerPair["NORTH_SOUTH"] = 1] = "NORTH_SOUTH";
    })(PlayerPair = exports.PlayerPair || (exports.PlayerPair = {}));
    class Player {
        constructor(d) {
            const i = typeof d === 'number' ? d : d.getValue();
            this.hand = [];
            this.played = [];
            this.tricks = [];
            this.direction = i;
        }
        initWithExplicits(...valueSuits) {
            for (let i = 0; i < valueSuits.length; i++) {
                const values = valueSuits[i];
                for (let j = 0; j < values.length; j++) {
                    this.hand.push(Card_3.Card.getFromValues(values[j], SuitCollection_3.SuitCollection.list[i]));
                }
            }
            return this;
        }
        initWithCards(cards) {
            this.hand = cards.slice();
            return this;
        }
        initWithCardsAndPlayed(cards, played) {
            this.hand = cards.slice();
            this.played = played.slice();
            return this;
        }
        initWithOther(other) {
            this.hand = other.hand.slice();
            this.played = other.played.slice();
            return this;
        }
        contains(list, c) {
            return list.indexOf(c) > -1;
        }
        hasUnplayedCard(c) {
            return this.contains(this.hand, c);
        }
        getUnplayedCardsCount() {
            return this.hand.length;
        }
        getDirection() {
            return this.direction;
        }
        hasPlayedCard(c) {
            return this.contains(this.played, c);
        }
        countTricksTaken() {
            return this.tricks.length;
        }
        addTrickTaken(trick, trickNo) {
            if (trickNo)
                trick.trickNo = trickNo;
            this.tricks.push(trick);
        }
        getPossibleMoves(trick) {
            const d = trick.getDenomination();
            const matching = this.hand.filter(c => c.denomination === d);
            let result;
            if (matching.length === 0) {
                result = new Hand_1.Hand(this.hand.slice()).getCardsHighToLow().reverse();
            }
            else {
                result = new Hand_1.Hand(matching).getCardsHighToLow().reverse();
            }
            return result;
        }
        play(trick, moveIndex) {
            const moves = this.getPossibleMoves(trick);
            if (moves.length === 0) {
                console.error(`${this.toString()} has no possible move for ${trick.toString()} (hand: ${this.hand.toString()})`);
            }
            if (moveIndex === undefined)
                moveIndex = moves.length - 1;
            const c = moves[moveIndex];
            this.played.push(c);
            this.hand.splice(this.hand.indexOf(c), 1);
            return c;
        }
        playCard(c) {
            this.played.push(c);
            this.hand.splice(this.hand.indexOf(c), 1);
            return c;
        }
        pair() {
            return Player.matchPair(this.direction);
        }
        static matchPair(player) {
            let result;
            switch (player) {
                case Direction_2.Direction.WEST:
                case Direction_2.Direction.EAST:
                    result = PlayerPair.WEST_EAST;
                    break;
                case Direction_2.Direction.NORTH:
                case Direction_2.Direction.SOUTH:
                    result = PlayerPair.NORTH_SOUTH;
                    break;
                default:
                    throw new Error("Unknown player: " + player);
            }
            return result;
        }
        otherPair() {
            return Player.matchPair((this.direction + 1) % 4);
        }
        isPartnerWith(other) {
            return this.pair() == other.pair();
        }
        toString() {
            return Direction_2.DirectionCollection.instance(this.direction).toString();
        }
    }
    exports.Player = Player;
});
define("core/GameUtils", ["require", "exports", "core/Card", "core/deck/SuitCollection", "core/Direction", "core/Hand"], function (require, exports, Card_4, SuitCollection_4, Direction_3, Hand_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GameUtils = exports.PLAY_REFERENCE_GAME = void 0;
    exports.PLAY_REFERENCE_GAME = false;
    let pos = 0;
    const a_multi = [
        0.12, 0.64, 0.23, 0.25, 0.33, 0.73, 0.91, 0.28, 0.9, 0.22
    ];
    const b_multi = [
        0.41, 0.62, 0.81, 0.2
    ];
    function nonrandom() {
        pos += 1;
        const x = a_multi[pos % a_multi.length] * b_multi[pos % b_multi.length] * 2;
        if (x > 1)
            return x - 1.0;
        return x;
    }
    class GameUtils {
        static initializeSingleColorSuits(g, cc) {
            const cardCount = cc === undefined ? 13 : cc;
            for (let i = Direction_3.Direction.WEST; i <= Direction_3.Direction.SOUTH; i++) {
                let spades = [];
                let hearts = [];
                let diamonds = [];
                let clubs = [];
                const currentHand = new Array(cardCount);
                for (let j = 0; j < cardCount; j++) {
                    currentHand[j] = Card_4.Card.FullSuit[j];
                }
                switch (i) {
                    case Direction_3.Direction.WEST:
                        spades = currentHand;
                        break;
                    case Direction_3.Direction.NORTH:
                        hearts = currentHand;
                        break;
                    case Direction_3.Direction.EAST:
                        diamonds = currentHand;
                        break;
                    case Direction_3.Direction.SOUTH:
                        clubs = currentHand;
                        break;
                }
                g.getPlayer(i).initWithExplicits(spades, hearts, diamonds, clubs);
            }
        }
        static initializeRandom(input, cardCount, overrideRandomizer) {
            const players = input.players || input;
            const deck = GameUtils.buildDeck();
            if (cardCount === undefined)
                cardCount = 13;
            players.forEach((player) => {
                const hand = [];
                for (let j = 0; j < cardCount; j++) {
                    hand.push(GameUtils.dealRandom(deck, overrideRandomizer)); // Card.getFromValues(Card.FullSuit[j], SuitCollection.list[i]));
                }
                player.initWithCards(new Hand_2.Hand(hand).getCardsHighToLow());
            });
        }
        static dealRandom(ideck, overrideRandomizer) {
            const randomizer = overrideRandomizer || (exports.PLAY_REFERENCE_GAME ? nonrandom : Math.random);
            const index = Math.floor(randomizer() * ideck.length);
            const card = ideck[index];
            ideck.splice(index, 1);
            return card;
        }
        static buildDeck() {
            const result = [];
            Card_4.Card.FullSuit.forEach((value) => {
                SuitCollection_4.SuitCollection.list.forEach((denomination) => {
                    result.push(Card_4.Card.getFromValues(value, denomination));
                });
            });
            return result;
        }
    }
    exports.GameUtils = GameUtils;
});
define("core/Deal", ["require", "exports", "core/Card", "core/deck/NoTrump", "core/deck/SuitCollection", "core/Direction", "core/GameUtils", "core/Hand", "core/Player", "core/Trick"], function (require, exports, Card_5, NoTrump_2, SuitCollection_5, Direction_4, GameUtils_1, Hand_3, Player_1, Trick_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Deal = void 0;
    class Deal {
        constructor(trump) {
            this.players = new Array(4);
            for (let i = Direction_4.Direction.WEST; i <= Direction_4.Direction.SOUTH; i++) {
                this.players[i] = new Player_1.Player(i);
            }
            this.nextToPlay = Direction_4.Direction.WEST;
            this.trump = trump;
            this.currentTrick = new Trick_1.Trick(trump);
            this.tricksPlayed = 0;
            this.done = false;
            this.playedCards = new Hand_3.Hand();
            this.winningCards = [];
        }
        getPlayer(i) {
            return this.players[i];
        }
        getWest() {
            return this.players[Direction_4.Direction.WEST];
        }
        getNorth() {
            return this.players[Direction_4.Direction.NORTH];
        }
        getEast() {
            return this.players[Direction_4.Direction.EAST];
        }
        getSouth() {
            return this.players[Direction_4.Direction.SOUTH];
        }
        setPlayer(i, p) {
            this.players[i] = p;
        }
        getPlayedCardsHiToLow(color) {
            return this.playedCards.getSuitHi2Low(color);
        }
        doNextCard(forcedMoveIndex) {
            let card;
            if (forcedMoveIndex === undefined) {
                card = this.players[this.nextToPlay].play(this.currentTrick);
            }
            else {
                card = this.players[this.nextToPlay].play(this.currentTrick, forcedMoveIndex);
            }
            this.playedCards.add(card);
            this.currentTrick.addCard(card, this.players[this.nextToPlay]);
            if (this.currentTrick.isDone()) {
                const winner = this.getWinnerIndex(this.currentTrick);
                this.nextToPlay = winner;
                this.players[winner].addTrickTaken(this.currentTrick, this.tricksPlayed);
                this.winningCards.push(this.currentTrick.cardPlayedBy(winner));
                this.previousTrick = this.currentTrick;
                this.currentTrick = new Trick_1.Trick(this.trump);
                this.tricksPlayed++;
            }
            else {
                this.nextToPlay = (this.nextToPlay + 1) % this.players.length;
            }
            if (this.players[this.nextToPlay].getUnplayedCardsCount() === 0) {
                this.done = true;
            }
        }
        getPreviousTrick() {
            return this.previousTrick;
        }
        getWinnerIndex(trick) {
            for (let i = 0; i < this.players.length; i++) {
                if (this.players[i].hasPlayedCard(trick.getHighestCard())) {
                    return i;
                }
            }
            throw new Error("Cannot find winning player for trick: " + trick);
        }
        isDone() {
            return this.done;
        }
        getNextToPlay() {
            return this.players[this.nextToPlay];
        }
        duplicate() {
            const result = new Deal(this.trump);
            for (let i = Direction_4.Direction.WEST; i <= Direction_4.Direction.SOUTH; i++) {
                result.getPlayer(i).initWithOther(this.getPlayer(i));
            }
            result.nextToPlay = this.nextToPlay;
            result.setCurrentTrick(this.currentTrick.duplicate());
            if (this.previousTrick != null) {
                result.setPreviousTrick(this.previousTrick.duplicate());
            }
            result.setPlayedCards(this.playedCards.getCardsHighToLow());
            return result;
        }
        setPreviousTrick(trick) {
            this.previousTrick = trick;
        }
        setPlayedCards(cards) {
            this.playedCards = new Hand_3.Hand(cards);
        }
        setCurrentTrick(trick) {
            this.currentTrick = trick;
        }
        playMoves(moves) {
            moves.forEach((move) => this.doNextCard(move));
        }
        setNextToPlay(direction) {
            this.nextToPlay = direction;
        }
        getTricksTaken(pair) {
            switch (pair) {
                case Player_1.PlayerPair.WEST_EAST:
                    return this.getPlayer(Direction_4.Direction.WEST).countTricksTaken() + this.getPlayer(Direction_4.Direction.EAST).countTricksTaken();
                case Player_1.PlayerPair.NORTH_SOUTH:
                    return this.getPlayer(Direction_4.Direction.NORTH).countTricksTaken() + this.getPlayer(Direction_4.Direction.SOUTH).countTricksTaken();
                default:
                    throw new Error(`Unknown pair: ${pair}`);
            }
        }
        getDistortedTricksTaken(pair, rules) {
            if (!rules.trickPenalty && !rules.facePenalty && !rules.shortSuitBump)
                return this.getTricksTaken(pair);
            const saneFaceOffset = Math.min((rules.faceOffset || 0) + 9, 12);
            const saneBumpRequires = Math.max((rules.bumpRequires || 0), 4);
            const countTricks = (d) => this.getPlayer(d).tricks.reduce((acc, t) => acc + (1 - Math.max(t.trickNo, 0) * (rules.trickPenalty || 0)), 0);
            const countWastedFacesBy = (pair) => {
                const d1 = (pair === Player_1.PlayerPair.WEST_EAST) ? Direction_4.Direction.NORTH : Direction_4.Direction.WEST;
                const d2 = (pair === Player_1.PlayerPair.WEST_EAST) ? Direction_4.Direction.SOUTH : Direction_4.Direction.EAST;
                const d3 = (pair === Player_1.PlayerPair.WEST_EAST) ? Direction_4.Direction.WEST : Direction_4.Direction.NORTH;
                const d4 = (pair === Player_1.PlayerPair.WEST_EAST) ? Direction_4.Direction.EAST : Direction_4.Direction.SOUTH;
                const tricks = this.getPlayer(d1).tricks.concat(this.getPlayer(d2).tricks);
                return tricks.reduce((acc, t) => {
                    return acc +
                        Math.max((t.cardPlayedBy(d3).value - saneFaceOffset) * (rules.facePenalty || 0), 0) +
                        Math.max((t.cardPlayedBy(d4).value - saneFaceOffset) * (rules.facePenalty || 0), 0);
                }, 0);
            };
            const shortSuitBump = (pair) => {
                if ((rules.shortSuitBump || 0) < 0.00001)
                    return 0;
                const p1 = this.getPlayer((pair === Player_1.PlayerPair.WEST_EAST) ? Direction_4.Direction.WEST : Direction_4.Direction.NORTH);
                const p2 = this.getPlayer((pair === Player_1.PlayerPair.WEST_EAST) ? Direction_4.Direction.EAST : Direction_4.Direction.SOUTH);
                if (p1.hand.length < Math.max(saneBumpRequires, 4))
                    return 0;
                const counts1 = [0, 0, 0, 0];
                p1.hand.forEach(c => counts1[c.denomination.index]++);
                const counts2 = [0, 0, 0, 0];
                p2.hand.forEach(c => counts2[c.denomination.index]++);
                if (this.trump === NoTrump_2.NoTrump)
                    return 0;
                if (!p1.hand[this.trump.index])
                    return 0;
                if (!p2.hand[this.trump.index])
                    return 0;
                return SuitCollection_5.SuitCollection.list.map(suit => {
                    if (this.trump === suit)
                        return 0;
                    const len = p1.hand.length;
                    const max = Math.max((counts1[suit.index] * counts2[this.trump.index]) / len, (counts2[suit.index] * counts1[this.trump.index]) / len);
                    const min = Math.min(counts1[suit.index], counts2[suit.index]);
                    return Math.max(max - min, 0);
                }).reduce((acc, x) => acc + x) * rules.shortSuitBump;
            };
            let result;
            switch (pair) {
                case Player_1.PlayerPair.WEST_EAST:
                    result = countTricks(Direction_4.Direction.WEST) + countTricks(Direction_4.Direction.EAST) - countWastedFacesBy(Player_1.PlayerPair.WEST_EAST) + shortSuitBump(Player_1.PlayerPair.WEST_EAST);
                    break;
                case Player_1.PlayerPair.NORTH_SOUTH:
                    result = countTricks(Direction_4.Direction.NORTH) + countTricks(Direction_4.Direction.SOUTH) - countWastedFacesBy(Player_1.PlayerPair.NORTH_SOUTH) + shortSuitBump(Player_1.PlayerPair.NORTH_SOUTH);
                    break;
                default:
                    throw new Error(`Unknown pair: ${pair}`);
            }
            return Math.max(result, -0.7); /* we want negative numbers but -1 has a special meaning */
        }
        oneTrickLeft() {
            return (this.currentTrick.getHighestCard() == null && this.getNextToPlay().hand.length === 1);
        }
        setTrump(d) {
            this.trump = d;
            if (this.currentTrick != null) {
                this.currentTrick.setTrump(d);
            }
        }
        getTricksPlayed() {
            return Math.floor(this.playedCards.cards.length / 4);
        }
        getTricksPlayedSinceSearchStart() {
            return this.tricksPlayed;
        }
        getPlayerDirection(d) {
            return this.getPlayer(d.getValue());
        }
        isLegalMove(card) {
            return this.getNextToPlay().getPossibleMoves(this.currentTrick).indexOf(card) > -1;
        }
        play(card) {
            const c = (typeof card === 'string') ? Card_5.Card.get(card) : card;
            const possibleMoves = this.getNextToPlay().getPossibleMoves(this.currentTrick);
            this.doNextCard(possibleMoves.indexOf(c));
        }
        setHumanPlayer(p) {
            this.preInitializedHumanPlayer = p;
        }
        selectHumanPlayer() {
            let result;
            if (this.preInitializedHumanPlayer != null) {
                result = this.preInitializedHumanPlayer;
                this.preInitializedHumanPlayer = null;
            }
            else {
                result = this.players[Math.floor(Math.random() * this.players.length)];
            }
            return result;
        }
        static setPreInitializedGame(preInitializedGame) {
            Deal.preInitializedGame = preInitializedGame;
        }
        static construct() {
            let result;
            if (Deal.preInitializedGame != null) {
                result = Deal.preInitializedGame;
                Deal.preInitializedGame = null;
            }
            else {
                result = new Deal(null);
                GameUtils_1.GameUtils.initializeRandom(result.players, 13);
            }
            return result;
        }
        printHandsDebug() {
            this.players.forEach((player) => {
                console.log(`game.get${player.toString()}().init(${this.makeHandDebug(player.hand)});`);
            });
            console.log(`game.setNextToPlay(Direction.${this.getNextToPlay().toString().toUpperCase()});`);
            if (this.trump != null) {
                console.log(`game.setTrump(${this.trump.toDebugString()});`);
            }
        }
        printHands() {
            this.players.forEach((player) => {
                console.log(`${player}: ${player.hand.map(c => c.toString())}`);
            });
        }
        makeHandDebug(cards) {
            let result = cards.map((card) => card.toDebugString()).join(", ");
            let noLeadingCommaOnFirstElement = true;
            cards.forEach((card) => {
                {
                    if (noLeadingCommaOnFirstElement) {
                        noLeadingCommaOnFirstElement = false;
                    }
                    else {
                        result += ", ";
                    }
                    result += card.toDebugString();
                }
            });
            return result;
        }
        playOneTrick() {
            for (let i = 0; i < 4; i++) {
                this.play(this.getNextToPlay().hand[0]);
            }
        }
        getKeyForWeakHashMap() {
            let unique = 0;
            this.playedCards.getCardsHighToLow().forEach((card) => {
                unique |= (1 << card.getIndex());
            });
            unique |= (((this.getNextToPlay().getDirection() << 4) + this.getNorthSouthTricksTaken()) << 52);
            return unique;
        }
        getNorthSouthTricksTaken() {
            return this.getTricksTaken(Player_1.PlayerPair.NORTH_SOUTH);
        }
    }
    exports.Deal = Deal;
});
define("core/search/PositionLookup", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PositionLookup = void 0;
    class PositionLookup {
        constructor() {
            this.positions = {};
        }
        positionEncountered(g, bs) {
            if (g.currentTrick.getHighestCard() != null) {
                return false;
            }
            const valueToReturn = this.getNode(g);
            if (valueToReturn == null) {
                this.putNode(g, bs);
                return false;
            }
            return true;
        }
        getNode(g) {
            if (g == this.lastGameLookedUp) {
                return this.lastNode;
            }
            const result = this.positions[g.getKeyForWeakHashMap()];
            if (result != null) {
                this.lastGameLookedUp = g;
                this.lastNode = result;
            }
            return result;
        }
        putNode(g, value) {
            this.positions[g.getKeyForWeakHashMap()] = value;
        }
    }
    exports.PositionLookup = PositionLookup;
});
define("core/search/rules/utils", ["require", "exports", "core/Card"], function (require, exports, Card_6) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPlayerWith = exports.getLowestAssumeOneSuit = exports.getLowestEachSuit = void 0;
    function getLowestEachSuit(arr) {
        const sortedMoves = arr.slice(0).sort((a, b) => (a.denomination.index === b.denomination.index) ?
            (a.value - b.value) :
            (b.denomination.index - b.denomination.index));
        const lowestEachSuit = sortedMoves.filter((card, i) => {
            if (i === 0)
                return true;
            if (card.denomination !== sortedMoves[i - 1].denomination)
                return true;
        });
        return lowestEachSuit;
    }
    exports.getLowestEachSuit = getLowestEachSuit;
    function getLowestAssumeOneSuit(arr) {
        let assertFailure = false;
        arr.sort((a, b) => {
            if (a.denomination.index === b.denomination.index) {
                return (a.value - b.value);
            }
            else {
                assertFailure = true;
                return (b.denomination.index - b.denomination.index);
            }
        });
        return assertFailure ? arr : arr.slice(0, 1);
    }
    exports.getLowestAssumeOneSuit = getLowestAssumeOneSuit;
    function getPlayerWith(rank, suit, position) {
        return position.players.reduce((res, p) => {
            if (res !== undefined)
                return res;
            if (p.hasUnplayedCard(Card_6.Card.getFromValues(rank, suit))) {
                return p.getDirection();
            }
        }, undefined);
    }
    exports.getPlayerWith = getPlayerWith;
});
define("core/search/rules/AlwaysPlayWinner", ["require", "exports", "core/search/rules/utils"], function (require, exports, utils_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.alwaysPlayWinner = void 0;
    /*
      IF it is the last play of the trick
      |-> IF the partner is not winning
          |-> FIND the winning cards
              |-> RETURN for consideration the lowest winning card
    
      IF it is the last play of the trick
      |-> IF the partner is winning
          |-> IF neverTakeFromPartner is true
              |-> RETURN for consideration the lowest of each suit minus the trump suit if possible
    */
    function alwaysPlayWinner(moves, position, player, rules) {
        if (rules.alwaysPlayWinnerOnLastTurn) {
            const curTrick = position.currentTrick;
            if (curTrick.getCardsPlayed() === 3) {
                const partnerIsWinning = curTrick.whoPlayed(curTrick.getHighestCard()).isPartnerWith(player);
                if (!partnerIsWinning || (partnerIsWinning && rules.neverTakeFromPartner)) {
                    if (partnerIsWinning) {
                        const inversionLowestEachSuit = utils_1.getLowestEachSuit(moves);
                        if (inversionLowestEachSuit.length > 1)
                            return inversionLowestEachSuit.filter((card) => card.denomination !== position.trump);
                        else
                            return inversionLowestEachSuit;
                    }
                    else {
                        const candidate = moves.filter(card => {
                            const trick = curTrick.duplicate();
                            trick.addCard(card, player);
                            return trick.whoPlayed(trick.getHighestCard()) === player;
                        });
                        if (!partnerIsWinning && candidate.length > 0) {
                            return utils_1.getLowestAssumeOneSuit(candidate);
                        }
                    }
                }
            }
        }
        return null;
    }
    exports.alwaysPlayWinner = alwaysPlayWinner;
});
define("core/search/RuleFilters", ["require", "exports", "core/search/rules/AlwaysPlayWinner"], function (require, exports, AlwaysPlayWinner_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.applyRuleFilters = void 0;
    function applyRuleFilters(moves, position, player, rules, contract) {
        let lastResult;
        if (!moves || !moves.length)
            return moves;
        if (!rules)
            return moves;
        // Pro-tip: you can really improve things using these rules!
        lastResult = AlwaysPlayWinner_1.alwaysPlayWinner(moves, position, player, rules);
        if (lastResult && lastResult.length > 0) {
            return rules.noDeepSearch ? [lastResult[0]] : lastResult;
        }
        return rules.noDeepSearch ? [moves[Math.floor(Math.random() * moves.length)]] : moves;
    }
    exports.applyRuleFilters = applyRuleFilters;
});
define("core/search/SearchNode", ["require", "exports", "core/Player", "core/search/RuleFilters"], function (require, exports, Player_2, RuleFilters_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchNode = void 0;
    class SearchNode {
        constructor(parent, playerTurn) {
            this.trimmed = false;
            this.isLeaf = false;
            this.pruned = false;
            this.pruneType = SearchNode.PRUNE_ALPHA - 1;
            this.valueSet = false;
            this.rules = {};
            this.parent = parent;
            this.children = [];
            if (parent != null) {
                parent.children.push(this);
            }
            this.tricksTaken = [];
            this.tricksTaken[Player_2.PlayerPair.WEST_EAST] = SearchNode.UNINITIALIZED;
            this.tricksTaken[Player_2.PlayerPair.NORTH_SOUTH] = SearchNode.UNINITIALIZED;
            if (playerTurn !== undefined)
                this.setPlayerTurn(playerTurn);
        }
        getMyIndex(node) {
            return this.children.findIndex((x) => x.cardPlayed === node.cardPlayed);
        }
        printOptimalPath(g) {
            const move = this.getBestMove();
            const toReadable = ['W', 'N', 'E', 'S'];
            let result = "";
            const originalDir = toReadable[g.nextToPlay];
            result += `Optimal path for ${originalDir}...\n`;
            if (move == this) {
                const moveIdxs = this.getMoves();
                moveIdxs.forEach((moveIdx) => {
                    const currentTrick = g.currentTrick;
                    const allPossibleMoves = g.getNextToPlay().getPossibleMoves(currentTrick);
                    const possibleMoves = RuleFilters_1.applyRuleFilters(allPossibleMoves, g, g.getNextToPlay(), this.rules);
                    result += " " + g.getNextToPlay() + ": " + possibleMoves[moveIdx] + ` (${moveIdx}) ${possibleMoves}\n`;
                    if (!possibleMoves[moveIdx])
                        return;
                    g.doNextCard(allPossibleMoves.indexOf(possibleMoves[moveIdx]));
                    if (currentTrick.isDone()) {
                        result += "  Trick taken by " + g.getPlayer(g.getWinnerIndex(currentTrick)) + "\n";
                    }
                });
            }
            else if (move) {
                return move.printOptimalPath(g);
            }
            result += `Optimal path for ${originalDir} concludes\n\n`;
            return result;
        }
        getMoves() {
            if (this.parent == null) {
                return [];
            }
            else {
                const result = this.parent.getMoves();
                result.push(this.parent.getMyIndex(this));
                return result;
            }
        }
        setPlayerTurn(direction) {
            this.playerTurn = direction;
        }
        setTricksTaken(pair, i) {
            this.valueSet = true;
            this.tricksTaken[pair] = i;
        }
        isLastVisitedChild(child) {
            let hasThisChild = false;
            let overrideWithFalse = false;
            this.children.forEach((sibling) => {
                if (sibling && !overrideWithFalse) {
                    if (sibling == child) {
                        hasThisChild = true;
                    }
                    else {
                        if (!sibling.isLeaf && !sibling.trimmed && !sibling.isPruned()) {
                            overrideWithFalse = true;
                        }
                    }
                }
            });
            if (overrideWithFalse)
                return false;
            return hasThisChild;
        }
        getCurrentPair() {
            return Player_2.Player.matchPair(this.getPlayerTurn());
        }
        getPlayerTurn() {
            return this.playerTurn;
        }
        getTricksTaken(pair) {
            return this.tricksTaken[pair];
        }
        getBestMove() {
            if (this.children.length == 0) {
                return this;
            }
            const max = this.getTricksTaken(this.getCurrentPair());
            const childrenWithSameTricksTaken = [];
            this.children.forEach((move) => {
                if (move != null && (this.rules.considerPrunedMoves || !move.isPruned()) && move.getTricksTaken(this.getCurrentPair()) == max) {
                    childrenWithSameTricksTaken.push(move);
                }
            });
            return this.getNodeWithLowestValueCard(childrenWithSameTricksTaken);
        }
        getNodeWithLowestValueCard(nodes) {
            let lowest = null;
            nodes.forEach((node) => {
                if (lowest == null || node.cardPlayed.value < lowest.cardPlayed.value) {
                    lowest = node;
                }
            });
            return lowest;
        }
        printLeafs() {
            if (this.isLeaf) {
                return "*********\nNode: [" + this.getMoves().join(", ") + "]\n" + this.printMoves() + "\n";
            }
            else {
                let result = "";
                this.children.forEach((child) => {
                    if (child != null) {
                        result += child.printLeafs();
                    }
                });
                return result;
            }
        }
        printMoves() {
            if (this.isRoot()) {
                return "";
            }
            else {
                return this.parent.printMoves() + this.getPlayerCardPlayed() + ": " + this.cardPlayed + (this.isPruned() ? " (pruned " + this.pruneTypeToString() + ")" : "") + "\n";
            }
        }
        pruneTypeToString() {
            let result = "UNKNOWN";
            if (this.pruneType == SearchNode.PRUNE_ALPHA) {
                result = "ALPHA";
            }
            else if (this.pruneType == SearchNode.PRUNE_BETA) {
                result = "BETA";
            }
            else if (this.pruneType == SearchNode.PRUNE_DUPLICATE_POSITION) {
                result = "DUPLICATE POSITION";
            }
            else if (this.pruneType == SearchNode.PRUNE_SEQUENCE_SIBLINGS) {
                result = "SIBLING SEQUENCE";
            }
            else if (this.pruneType == SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED) {
                result = "SIBLING IN PLAYED SEQUENCE";
            }
            return result;
        }
        isRoot() {
            return this.parent == null;
        }
        setLeaf(b) {
            this.isLeaf = b;
        }
        setPruned(b, type) {
            this.pruned = b;
            this.pruneType = type;
        }
        isPruned() {
            if (this.parent == null) {
                return this.pruned;
            }
            else if (this.pruned) {
                return true;
            }
            else {
                return this.parent.isPruned();
            }
        }
        isAlpha() {
            return this.getMaxPlayer() === this.getCurrentPair();
        }
        getRoot() {
            if (this.parent == null) {
                return this;
            }
            else {
                return this.parent.getRoot();
            }
        }
        isAlphaPruned() {
            return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_ALPHA);
        }
        isBetaPruned() {
            return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_BETA);
        }
        getPruneType() {
            if (this.parent == null) {
                return this.pruneType;
            }
            else if (this.pruned) {
                return this.pruneType;
            }
            else {
                return this.parent.getPruneType();
            }
        }
        hasAlphaAncestor() {
            if (this.parent == null) {
                return false;
            }
            else if (this.parent.isAlpha()) {
                return true;
            }
            else {
                return this.parent.hasAlphaAncestor();
            }
        }
        hasBetaAncestor() {
            if (this.parent == null) {
                return false;
            }
            else if (this.parent.isBeta()) {
                return true;
            }
            else {
                return this.parent.hasBetaAncestor();
            }
        }
        isBeta() {
            return !this.isAlpha();
        }
        betaPrune() {
            if (this.parent != null && !this.parent.isBeta()) {
                this.parent.setTricksTaken(Player_2.PlayerPair.WEST_EAST, this.getTricksTaken(Player_2.PlayerPair.WEST_EAST));
                this.parent.setTricksTaken(Player_2.PlayerPair.NORTH_SOUTH, this.getTricksTaken(Player_2.PlayerPair.NORTH_SOUTH));
                this.parent.setPruned(true, SearchNode.PRUNE_BETA);
                this.parent.betaPrune();
            }
        }
        alphaPrune() {
            if (this.parent != null && !this.parent.isAlpha() && !this.parent.parent.isRoot()) {
                this.parent.setTricksTaken(Player_2.PlayerPair.WEST_EAST, this.getTricksTaken(Player_2.PlayerPair.WEST_EAST));
                this.parent.setTricksTaken(Player_2.PlayerPair.NORTH_SOUTH, this.getTricksTaken(Player_2.PlayerPair.NORTH_SOUTH));
                this.parent.setPruned(true, SearchNode.PRUNE_ALPHA);
                this.alphaAtPruneTime = this.parent.getLocalAlphaNode();
                this.parent.alphaPrune();
            }
        }
        setPlayerCardPlayed(player) {
            this.playerCardPlayed = player;
        }
        getPlayerCardPlayed() {
            return this.playerCardPlayed;
        }
        hasAncestor(ancestor) {
            if (this == ancestor) {
                return true;
            }
            else if (this.parent == null) {
                return false;
            }
            else {
                return this.parent.hasAncestor(ancestor);
            }
        }
        getLocalAlpha() {
            const localAlpha = this.getLocalAlphaNode();
            if (localAlpha != null) {
                return this.getLocalAlphaNode().getTricksTaken(this.getMaxPlayer());
            }
            else {
                return SearchNode.ALPHA_UNINIT;
            }
        }
        getLocalAlphaNode() {
            if (this.isAlpha()) {
                let max = SearchNode.ALPHA_UNINIT;
                let result = null;
                this.children.forEach((child) => {
                    if (child.getTricksTaken(this.getMaxPlayer()) > max) {
                        max = child.getTricksTaken(this.getMaxPlayer());
                        result = child;
                    }
                });
                return result;
            }
            else {
                return this.parent.getLocalAlphaNode();
            }
        }
        getUniqueId() {
            let myIndex = 0;
            if (this.parent != null) {
                myIndex = this.parent.getMyIndex(this);
            }
            return this.getDepth() + "-" + myIndex;
        }
        getLocalBeta() {
            if (this.isBeta()) {
                let min = SearchNode.BETA_UNINIT;
                this.children.forEach((child) => {
                    if (child.getTricksTaken(this.getMaxPlayer()) != -1 &&
                        child.getTricksTaken(this.getMaxPlayer()) < min) {
                        min = child.getTricksTaken(this.getMaxPlayer());
                    }
                });
                return min;
            }
            else {
                return this.parent.getLocalBeta();
            }
        }
        getMaxPlayer() {
            return this.getRoot().getCurrentPair();
        }
        shouldBeAlphaPruned() {
            return !this.rules.disableAlphaPrune && this.valueSet && this.parent != null &&
                this.parent.parent != null && this.hasAlphaAncestor() && !this.parent.isAlpha() &&
                (this.getTricksTaken(this.getMaxPlayer()) <= this.parent.getLocalAlpha());
        }
        shouldBeBetaPruned() {
            return !this.rules.disableBetaPrune && this.valueSet && this.parent != null &&
                this.parent.parent != null && this.hasBetaAncestor() && !this.parent.isBeta() &&
                (this.getTricksTaken(this.getMaxPlayer()) >= this.parent.getLocalBeta());
        }
        toString() {
            return "Node " + this.getMoves().toString() +
                " / pruning status: " + this.isPruned() + " " +
                this.pruneTypeToString() + " / " + this.getPlayerCardPlayed() + ": " + this.cardPlayed +
                " Tricks WE|NS: " + this.tricksTaken[0] + "|" + this.tricksTaken[1];
        }
        siblings() {
            return this.parent.children.filter((child) => child !== this);
        }
        isSequencePruned() {
            return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_SEQUENCE_SIBLINGS);
        }
        getSiblingsInColor() {
            const cardsInSuit = [];
            this.siblings().forEach((sibling) => {
                if (sibling.cardPlayed.hasSameColorAs(this.cardPlayed)) {
                    cardsInSuit.push(sibling.cardPlayed);
                }
            });
            return cardsInSuit;
        }
        isPlayedSequencePruned() {
            return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED);
        }
        pruneAsDuplicatePosition() {
            this.setPruned(false, SearchNode.PRUNE_DUPLICATE_POSITION);
        }
        isPrunedDuplicatePosition() {
            return this.hasIdenticalTwin();
        }
        toDebugString() {
            let result = "";
            result += "Node: " + this.parent.getMyIndex(this) + ", " + this.cardPlayed + "\n";
            result += "pruned? " + this.isPruned() + "\n";
            result += "   alpha/beta: " + this.isAlphaPruned() + "/" + this.isBetaPruned() + "\n";
            result += "   sequence/played sequence: " + this.isSequencePruned() + "/" + this.isPlayedSequencePruned() + "\n";
            return result;
        }
        printAsTree() {
            let result = "";
            result = this.padSpaces(this.getDepth()) + this.getUniqueId() + " " +
                (this.getPlayerCardPlayed() || "root") + ": " +
                (this.cardPlayed || "root") + ", max: " + this.getTricksTaken(this.getMaxPlayer()) + ' v ' + this.getTricksTaken(this.getMaxPlayer() === Player_2.PlayerPair.NORTH_SOUTH ? Player_2.PlayerPair.WEST_EAST : Player_2.PlayerPair.NORTH_SOUTH) + this.getPruned();
            this.children.forEach((child) => {
                if (child != null) {
                    result += "\n" + child.printAsTree();
                }
                else {
                    result += "\n NULL";
                }
            });
            return result;
        }
        getPruned() {
            if (this.isAlphaPruned()) {
                let betterMove = "no better move available";
                if (this.alphaAtPruneTime != null) {
                    betterMove = this.alphaAtPruneTime.getUniqueId() + ": " + this.alphaAtPruneTime.cardPlayed + " with max " + this.alphaAtPruneTime.getTricksTaken(this.getMaxPlayer());
                }
                return ", alpha pruned (" + betterMove + ")";
            }
            else if (this.isBetaPruned()) {
                return ", beta pruned";
            }
            return "";
        }
        padSpaces(depth) {
            let result = "";
            for (let i = 0; i < depth; i++) {
                result += "   ";
            }
            return result;
        }
        getDepth() {
            if (this.parent == null) {
                return 0;
            }
            else {
                return 1 + this.parent.getDepth();
            }
        }
        // eslint-disable-next-line
        nullAllChildrenExceptOne() { }
        getUnprunedChildWithMostTricksForCurrentPair() {
            let maxChild = null;
            this.children.forEach((child) => {
                if (child != null && !child.isPruned() && (maxChild == null || child.getTricksTaken(this.getCurrentPair()) > maxChild.getTricksTaken(this.getCurrentPair()))) {
                    maxChild = child;
                }
            });
            return maxChild;
        }
        calculateValueFromChild() {
            const maxChild = this.getUnprunedChildWithMostTricksForCurrentPair();
            if (maxChild != null) {
                this.setTricksTaken(Player_2.PlayerPair.WEST_EAST, maxChild.getTricksTaken(Player_2.PlayerPair.WEST_EAST));
                this.setTricksTaken(Player_2.PlayerPair.NORTH_SOUTH, maxChild.getTricksTaken(Player_2.PlayerPair.NORTH_SOUTH));
            }
        }
        calculateValueFromPosition() {
            this.setTricksTaken(Player_2.PlayerPair.WEST_EAST, this.position.getDistortedTricksTaken(Player_2.PlayerPair.WEST_EAST, this.rules));
            this.setTricksTaken(Player_2.PlayerPair.NORTH_SOUTH, this.position.getDistortedTricksTaken(Player_2.PlayerPair.NORTH_SOUTH, this.rules));
        }
        setPosition(position) {
            this.position = position;
        }
        calculateValue() {
            if (this.isLeaf) {
                if (this.hasIdenticalTwin()) {
                    this.calculateValueFromIdenticalTwin();
                }
                else {
                    this.calculateValueFromPosition();
                }
            }
            else {
                this.calculateValueFromChild();
            }
        }
        calculateValueFromIdenticalTwin() {
            this.setTricksTaken(Player_2.PlayerPair.NORTH_SOUTH, this.identicalTwin[Player_2.PlayerPair.NORTH_SOUTH]);
            this.setTricksTaken(Player_2.PlayerPair.WEST_EAST, this.identicalTwin[Player_2.PlayerPair.WEST_EAST]);
        }
        hasIdenticalTwin() {
            return this.identicalTwin != null;
        }
        canTrim() {
            return this.parent != null && this.parent.isLastVisitedChild(this);
        }
        setIdenticalTwin(node) {
            this.identicalTwin = node;
        }
        getSiblingNodeForCard(card) {
            const result = this.siblings().find((sibling) => sibling.cardPlayed === card);
            if (!result)
                throw new Error("Cannot find appropriate sibling node");
            return result;
        }
        getUnprunedChildCount() {
            return this.children.reduce((acc, child) => {
                return acc + (child.isPruned() ? 0 : 1);
            }, 0);
        }
        // eslint-disable-next-line
        nullAllSubstandardChildren() { }
        pruneAsSequenceSibling() {
            this.setPruned(true, SearchNode.PRUNE_SEQUENCE_SIBLINGS);
        }
        pruneAsSequenceSiblingPlayed() {
            this.setPruned(true, SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED);
        }
        pruneAsAlpha() {
            this.setPruned(true, SearchNode.PRUNE_ALPHA);
        }
        pruneAsBeta() {
            this.setPruned(true, SearchNode.PRUNE_BETA);
        }
        getParent() {
            return this.parent;
        }
    }
    exports.SearchNode = SearchNode;
    SearchNode.UNINITIALIZED = -1;
    SearchNode.ALPHA_UNINIT = -1;
    SearchNode.BETA_UNINIT = 14;
    SearchNode.PRUNE_ALPHA = 0;
    SearchNode.PRUNE_BETA = SearchNode.PRUNE_ALPHA + 1;
    SearchNode.PRUNE_SEQUENCE_SIBLINGS = SearchNode.PRUNE_BETA + 1;
    SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED = SearchNode.PRUNE_SEQUENCE_SIBLINGS + 1;
    SearchNode.PRUNE_DUPLICATE_POSITION = SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED + 1;
});
define("core/search/PruningStrategy", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("core/search/AlphaBeta", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlphaBeta = void 0;
    class AlphaBeta {
        prune(node) {
            if (node.shouldBeAlphaPruned()) {
                node.alphaPrune();
            }
            if (node.shouldBeBetaPruned()) {
                node.betaPrune();
            }
            if (node.getParent() != null) {
                this.prune(node.getParent());
            }
        }
    }
    exports.AlphaBeta = AlphaBeta;
});
define("core/search/SolverConfigurator", ["require", "exports", "core/search/AlphaBeta"], function (require, exports, AlphaBeta_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DefaultSolverConfigurator = exports.SolverConfigurator = void 0;
    class SolverConfigurator {
        isUseAlphaBetaPruning() {
            return this.useAlphaBetaPruning;
        }
        setUseAlphaBetaPruning(useAlphaBetaPruning) {
            this.useAlphaBetaPruning = useAlphaBetaPruning;
        }
        configure(doubleDummySolver) {
            if (this.isUseAlphaBetaPruning()) {
                doubleDummySolver.addPostEvaluationPruningStrategy(new AlphaBeta_1.AlphaBeta());
            }
        }
    }
    exports.SolverConfigurator = SolverConfigurator;
    const DefaultSolverConfigurator = new SolverConfigurator();
    exports.DefaultSolverConfigurator = DefaultSolverConfigurator;
    DefaultSolverConfigurator.setUseAlphaBetaPruning(true);
});
define("core/search/DoubleDummySolver", ["require", "exports", "core/Player", "core/search/PositionLookup", "core/search/RuleFilters", "core/search/SearchNode", "core/search/SolverConfigurator"], function (require, exports, Player_3, PositionLookup_1, RuleFilters_2, SearchNode_1, SolverConfigurator_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DoubleDummySolver = void 0;
    class DoubleDummySolver {
        constructor(game, root, rules = {}, contract = undefined) {
            this.useDuplicateRemoval = true;
            this.shouldPruneCardsInSequence = true;
            this.terminateIfRootOnlyHasOneValidMove = true;
            this.postEvaluationPruningStrategies = [];
            this.configurator = null;
            const configurator = SolverConfigurator_1.DefaultSolverConfigurator;
            if (root) {
                this.root = root;
            }
            else {
                this.game = game;
                this.configurator = configurator;
                this.stack = [];
                this.maxTricks = rules.maxTricks || 3;
                this.finalMoves = [];
                this.finalMoves.push(0);
                this.finalMoves.push(0);
                this.finalMoves.push(0);
                this.finalMoves.push(0);
                this.rules = rules;
                this.contract = contract;
                this.lookup = new PositionLookup_1.PositionLookup();
                configurator.configure(this);
            }
        }
        setTerminateIfRootOnlyHasOneValidMove(terminateIfRootOnlyHasOneValidMove) {
            this.terminateIfRootOnlyHasOneValidMove = terminateIfRootOnlyHasOneValidMove;
        }
        addPostEvaluationPruningStrategy(strategy) {
            this.postEvaluationPruningStrategies.push(strategy);
        }
        search(maxSearch) {
            const start = Date.now();
            this.runningTime = 0;
            this.positionsCount = 0;
            this.root = new SearchNode_1.SearchNode(null);
            this.root.rules = this.rules || {};
            this.stack.push(this.root);
            if (!maxSearch)
                maxSearch = Math.max(0, this.rules.maxSearch) || 150000;
            while (this.stack.length !== 0 && this.positionsCount < maxSearch) {
                const node = this.stack.pop();
                this.examinePosition(node);
                this.positionsCount++;
            }
            this.runningTime = Date.now() - start;
        }
        setUseDuplicateRemoval(b) {
            this.useDuplicateRemoval = b;
        }
        setShouldPruneCardsInSequence(b) {
            this.shouldPruneCardsInSequence = b;
        }
        getPositionsExamined() {
            return this.positionsCount;
        }
        examinePosition(node) {
            if (node.isPruned())
                return;
            const position = this.game.duplicate();
            position.playMoves(node.getMoves());
            const player = position.getNextToPlay();
            node.setPlayerTurn(player.getDirection());
            node.setPosition(position);
            if (position.oneTrickLeft()) {
                position.playMoves(this.finalMoves);
            }
            const moves = player.getPossibleMoves(position.currentTrick);
            RuleFilters_2.applyRuleFilters(moves, position, player, this.rules, this.contract).forEach((card) => {
                this.makeChildNodeForCardPlayed(node, player, card);
            });
            this.checkDuplicatePositions(node, position);
            if (position.getTricksPlayedSinceSearchStart() >= this.maxTricks || position.isDone() || node.hasIdenticalTwin()) {
                node.setLeaf(true);
                this.trim(node);
            }
            else {
                node.children.forEach((move) => this.shouldPruneCardsInSequence &&
                    this.removeSiblingsInSequence(move));
                if (!this.rootOnlyHasOneValidMove(node) || !this.terminateIfRootOnlyHasOneValidMove) {
                    node.children.forEach((move) => this.stack.push(move));
                }
            }
        }
        rootOnlyHasOneValidMove(node) {
            if (node == this.root && node.getUnprunedChildCount() == 1) {
                return true;
            }
            else {
                return false;
            }
        }
        checkDuplicatePositions(node, position) {
            if (this.rules.disableDuplicateRemoval)
                return false;
            if (this.useDuplicateRemoval) {
                if (this.lookup.positionEncountered(position, node.tricksTaken)) {
                    const previouslyEncounteredNode = this.lookup.getNode(position);
                    node.setIdenticalTwin(previouslyEncounteredNode);
                }
            }
        }
        makeChildNodeForCardPlayed(parent, player, card) {
            const move = new SearchNode_1.SearchNode(parent);
            move.rules = this.rules || {};
            move.cardPlayed = card;
            move.setPlayerCardPlayed(player);
        }
        removeSiblingsInSequence(move) {
            const cardsInSuit = move.getSiblingsInColor();
            const shouldTrim = !!cardsInSuit.find((sibling) => (sibling.value - move.cardPlayed.value) === 1);
            if (shouldTrim) {
                move.pruneAsSequenceSibling();
            }
        }
        trim(node) {
            if (this.root == node) {
                node.nullAllSubstandardChildren();
            }
            else {
                node.nullAllChildrenExceptOne();
            }
            node.calculateValue();
            this.postEvaluationPruningStrategies.forEach((pruningStrategy) => {
                pruningStrategy.prune(node);
            });
            if (node.canTrim()) {
                this.trim(node.parent);
            }
            node.trimmed = true;
        }
        getBestMoves() {
            const result = [];
            const cardPlayed = this.root.getBestMove().cardPlayed;
            if (this.rules.printDebug) {
                const toReadable = ['W', 'N', 'E', 'S'];
                console.debug(`Debug information for ${toReadable[this.game.nextToPlay]}...`);
                console.debug(this.root.printAsTree().replace(/$\n/, ''));
                console.debug(this.root.printOptimalPath(this.game.duplicate()));
            }
            if (cardPlayed) {
                result.push(cardPlayed);
            }
            else {
                result.push(this.game.players[this.game.nextToPlay].hand[0]);
            }
            return result;
        }
        printStats() {
            let pruneType = "Unpruned";
            if (this.postEvaluationPruningStrategies.length > 0) {
                pruneType = "Pruned";
            }
            console.log(pruneType + " search took (msec): " + this.runningTime);
            console.log("  Positions examined: " + this.getPositionsExamined());
            console.log("West/East tricks taken: " + this.root.getTricksTaken(Player_3.PlayerPair.WEST_EAST));
            console.log("North/South tricks taken: " + this.root.getTricksTaken(Player_3.PlayerPair.NORTH_SOUTH));
        }
        getConfigurator() {
            return this.configurator;
        }
        setMaxTricks(i) {
            this.maxTricks = i;
        }
        getStack() {
            return this.stack;
        }
        getRoot() {
            return this.root;
        }
    }
    exports.DoubleDummySolver = DoubleDummySolver;
});
/* This file only under CC0 - public domain */
define("api/playing", ["require", "exports", "core/Card", "core/Deal", "core/deck/NoTrump", "core/deck/SuitCollection", "core/Direction", "core/Hand", "core/Player", "core/search/DoubleDummySolver", "core/Trick", "api/interfaces"], function (require, exports, Card_7, Deal_1, NoTrump_3, SuitCollection_6, Direction_5, Hand_4, Player_4, DoubleDummySolver_1, Trick_2, interfaces_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getComputerMove = exports.getComputerMoveWithRules = void 0;
    function getTrump(contract) {
        let trump;
        switch (contract.highestBid.substring(1)) {
            case 'NT':
                trump = NoTrump_3.NoTrump;
                break;
            default:
                trump = SuitCollection_6.SuitCollection.get(contract.highestBid.substring(1));
                break;
        }
        return trump;
    }
    function formulateTrick(contract, players, trick) {
        const trump = getTrump(contract);
        const result = new Trick_2.Trick(trump);
        if (!trick)
            return result;
        trick.order.forEach((d) => result.addCard(Card_7.Card.get(trick[interfaces_1.directionToKey[d]]), players[Direction_5.DirectionCollection.fromUniversal(d).getValue()]));
        return result;
    }
    function getComputerMoveWithRules(dealtHand, contract, rules, currentTrick) {
        const trump = getTrump(contract);
        const deal = new Deal_1.Deal(trump);
        deal.players = ['west', 'north', 'east', 'south'].map((key, i) => new Player_4.Player(i).initWithCardsAndPlayed(dealtHand[key].map(c => Card_7.Card.get(c)), dealtHand[`p${key}`].map(c => Card_7.Card.get(c))));
        deal.currentTrick = formulateTrick(contract, deal.players, currentTrick);
        deal.tricksPlayed = Math.floor(dealtHand.playedCards.length / 4);
        deal.playedCards = new Hand_4.Hand();
        dealtHand.playedCards.forEach(c => deal.playedCards.add(Card_7.Card.get(c)));
        deal.setNextToPlay(Direction_5.DirectionCollection.fromUniversal(dealtHand.nextToPlay).getValue());
        const solver = new DoubleDummySolver_1.DoubleDummySolver(deal, null, rules);
        solver.search();
        const handCards = dealtHand[interfaces_1.directionToKey[dealtHand.nextToPlay]];
        const bestCard = solver.getBestMoves()[0].getUniversal();
        if (handCards.indexOf(bestCard) === -1) {
            console.error("Assertion error: Computer asked to play card not in hand");
            // eslint-disable-next-line no-debugger
            debugger;
        }
        return bestCard;
    }
    exports.getComputerMoveWithRules = getComputerMoveWithRules;
    function getComputerMove(dealtHand, contract, currentTrick) {
        return getComputerMoveWithRules(dealtHand, contract, {}, currentTrick);
    }
    exports.getComputerMove = getComputerMove;
    let lastRequest;
    let lastResult;
    let corrId = 0;
    onmessage = function (e) {
        const hashCode = function (s) {
            let val = '';
            try {
                val = btoa('' + s.split("").reduce(function (a, b) { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).replace(/=/g, '');
            }
            catch (e) {
                undefined;
            }
            return val;
        };
        const oldCorrId = corrId;
        corrId++;
        const dealtHandsString = JSON.stringify(e.data.dealtHands);
        const contractString = JSON.stringify(e.data.contract);
        const rulesString = e.data.rules ? JSON.stringify(e.data.rules) : '';
        const trickString = e.data.currentTrick ? JSON.stringify(e.data.currentTrick) : '';
        const newRequest = `${dealtHandsString};${contractString};${trickString};${rulesString}`;
        if (e.data.doNotRespondCacheOnly)
            console.log(`${oldCorrId} - prefetch ${e.data.dealtHands.nextToPlay} (${hashCode(newRequest)})`);
        else
            console.log(`${oldCorrId} - ordinary play for ${e.data.dealtHands.nextToPlay} (${hashCode(newRequest)})`);
        if (newRequest !== lastRequest) {
            lastRequest = newRequest;
            const localDealtHands = JSON.parse(dealtHandsString);
            const localContract = JSON.parse(contractString);
            const localRules = rulesString ? JSON.parse(rulesString) : {};
            const localTrick = trickString ? JSON.parse(trickString) : undefined;
            lastResult = getComputerMoveWithRules(localDealtHands, localContract, localRules, localTrick);
        }
        else {
            console.log(`${oldCorrId} - Worker using cached response`);
        }
        if (!e.data.doNotRespondCacheOnly)
            postMessage(lastResult, undefined);
    };
});
/* End CC0 */
define("core/utility/HashSet", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HashSet = void 0;
    class HashSet {
        constructor() {
            this.content = [];
        }
        add(val) {
            if (!this.contains(val))
                this.content.push(val);
        }
        contains(val) {
            return this.content.indexOf(val) > -1;
        }
        forEach(callback) {
            this.content.forEach(callback);
        }
        asArray() {
            return this.content;
        }
        size() {
            return this.content.length;
        }
    }
    exports.HashSet = HashSet;
});

if (requireAndRun) requireAndRun("api/playing");
else require("api/playing");
