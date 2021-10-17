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
define("core/deck/NoTrump", ["require", "exports", "core/deck/Trump"], function (require, exports, Trump_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NoTrump = exports.NoTrumpClass = void 0;
    class NoTrumpClass extends Trump_1.Trump {
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
define("core/deck/Suit", ["require", "exports", "core/deck/Trump"], function (require, exports, Trump_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Suit = void 0;
    class Suit extends Trump_2.Trump {
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
define("core/bidding/Bid", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitValues"], function (require, exports, NoTrump_1, SuitValues_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Redouble = exports.Double = exports.Pass = exports.Bid = exports.REDOUBLE = exports.DOUBLE = exports.PASS = void 0;
    const do_not_use_outside = "shouldnotconstructotherthanBidCollection.ts";
    /*
      Unlike suits, cards and directions - there is no guarantee two equal bids
      are the same instance. This is because the bids have certain variable
      properties (forcing, gameForcing and doubled). You still should not construct
      a bid but instead clone the existing bid and toggle these properties. You
      definitely should not use indexOf() or === on bids as you might with suits,
      cards and directions.
    */
    const PASS_VALUE = -1;
    const DOUBLE_VALUE = -2;
    const REDOUBLE_VALUE = -3;
    exports.PASS = "PASS";
    exports.DOUBLE = "DOUBLE";
    exports.REDOUBLE = "REDOUBLE";
    class Bid {
        constructor(v, c, secret) {
            this.forcing = false;
            this.gameForcing = false;
            this.doubled = false;
            this.redoubled = false;
            if (secret !== do_not_use_outside) {
                throw new Error("Assert failure: Bid constructed without secret");
            }
            this.value = v;
            this.trump = c;
        }
        equals(other) {
            if (!other)
                return false;
            return this.value === other.value && this.trump === other.trump;
        }
        greaterThan(other) {
            if (other == null) {
                return true;
            }
            if (this.value === -1) {
                return false;
            }
            if (other.value === -1) {
                return true;
            }
            if (this.value > other.value) {
                return true;
            }
            else if (this.value < other.value) {
                return false;
            }
            else {
                return this.isColorGreater(other);
            }
        }
        isColorGreater(other) {
            if (SuitValues_1.Clubs === this.trump) {
                return false;
            }
            if (this.trump === SuitValues_1.Diamonds) {
                if (other.trump === SuitValues_1.Clubs) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (this.trump === SuitValues_1.Hearts) {
                if (other.trump === SuitValues_1.Clubs || other.trump === SuitValues_1.Diamonds) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (this.trump === SuitValues_1.Spades) {
                if (other.trump === SuitValues_1.Clubs || other.trump === SuitValues_1.Diamonds || other.trump === SuitValues_1.Hearts) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (other.trump !== NoTrump_1.NoTrump) {
                return true;
            }
            else {
                return false;
            }
        }
        toString() {
            return `${this.value} ${this.trump}`;
        }
        toUniversal() {
            return `${this.value}${this.trump.isNoTrump() ? 'NT' : this.trump.toString()[0]}`;
        }
        isPass() {
            return this.value === PASS_VALUE;
        }
        isForcing() {
            return this.forcing;
        }
        isGameForcing() {
            return this.gameForcing;
        }
        makeForcing() {
            this.forcing = true;
        }
        makeForcingAndClone() {
            const clone = new Bid(this.value, this.trump, do_not_use_outside);
            clone.doubled = this.doubled;
            clone.forcing = true;
            clone.gameForcing = this.gameForcing;
            clone.redoubled = this.redoubled;
            return clone;
        }
        makeGameForcing() {
            this.forcing = true;
            this.gameForcing = true;
        }
        makeGameForcingAndClone() {
            const clone = new Bid(this.value, this.trump, do_not_use_outside);
            clone.doubled = this.doubled;
            clone.forcing = true;
            clone.gameForcing = true;
            clone.redoubled = this.redoubled;
            return clone;
        }
        is1Suit() {
            if (this.value === 1 && this.trump.isSuit()) {
                return true;
            }
            else {
                return false;
            }
        }
        makeDoubled() {
            this.doubled = true;
        }
        makeRedoubled() {
            this.redoubled = true;
        }
        makeDoubledAndClone() {
            const clone = new Bid(this.value, this.trump, do_not_use_outside);
            clone.doubled = true;
            clone.forcing = this.forcing;
            clone.gameForcing = this.gameForcing;
            clone.redoubled = false;
            return clone;
        }
        makeRedoubledAndClone() {
            const clone = new Bid(this.value, this.trump, do_not_use_outside);
            clone.doubled = true;
            clone.forcing = this.forcing;
            clone.gameForcing = this.gameForcing;
            clone.redoubled = false;
            return clone;
        }
        isDoubled() {
            return this.doubled;
        }
        isRedoubled() {
            return this.redoubled;
        }
        /*
         * A note misnomer as no trumps will have trump - used to distinguish bids that are PASS, DOUBLE or REDOUBLE
         */
        hasTrump() {
            return this.trump !== null;
        }
        isDouble() {
            return this.value === DOUBLE_VALUE;
        }
        isRedouble() {
            return this.value === REDOUBLE_VALUE;
        }
        longDescription() {
            let result = this.toString();
            if (this.isDoubled()) {
                result += " (Doubled)";
            }
            return result;
        }
    }
    exports.Bid = Bid;
    class Pass extends Bid {
        constructor(secret) {
            super(PASS_VALUE, null, secret);
        }
        toString() {
            return exports.PASS;
        }
    }
    exports.Pass = Pass;
    class Double extends Bid {
        constructor(secret) {
            super(DOUBLE_VALUE, null, secret);
        }
        toString() {
            return "DOUBLE";
        }
    }
    exports.Double = Double;
    class Redouble extends Bid {
        constructor(secret) {
            super(REDOUBLE_VALUE, null, secret);
        }
        toString() {
            return "REDOUBLE";
        }
    }
    exports.Redouble = Redouble;
});
define("core/deck/SuitCollection", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitValues"], function (require, exports, NoTrump_2, SuitValues_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuitCollection = void 0;
    class SuitCollection {
        static getIndex(denomination) {
            return SuitCollection.reverseList.findIndex((x) => x === denomination);
        }
        static toUniversal(suit) {
            if (suit === NoTrump_2.NoTrump)
                return 'NT';
            if (suit === SuitValues_2.Spades)
                return 'S';
            if (suit === SuitValues_2.Hearts)
                return 'H';
            if (suit === SuitValues_2.Diamonds)
                return 'D';
            if (suit === SuitValues_2.Clubs)
                return 'C';
            throw new Error("Unrecognized suit");
        }
        static get(s) {
            if ("S" === s) {
                return SuitValues_2.Spades;
            }
            else if ("H" === s) {
                return SuitValues_2.Hearts;
            }
            else if ("D" === s) {
                return SuitValues_2.Diamonds;
            }
            else if ("C" === s) {
                return SuitValues_2.Clubs;
            }
            else {
                throw new Error(`do not know how to translate string '${s}' to a suit (need one of: S,H,D,C)`);
            }
        }
    }
    exports.SuitCollection = SuitCollection;
    SuitCollection.list = [SuitValues_2.Spades, SuitValues_2.Hearts, SuitValues_2.Diamonds, SuitValues_2.Clubs];
    SuitCollection.reverseList = [SuitValues_2.Clubs, SuitValues_2.Diamonds, SuitValues_2.Hearts, SuitValues_2.Spades];
    SuitCollection.mmList = [SuitValues_2.Hearts, SuitValues_2.Spades, SuitValues_2.Clubs, SuitValues_2.Diamonds];
});
define("core/bidding/BidCollection", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/Bid"], function (require, exports, NoTrump_3, SuitCollection_1, SuitValues_3, Bid_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BidCollection = void 0;
    const secret = "shouldnotconstructotherthanBidCollection.ts";
    class BidCollection {
        static cloneBid(b) {
            if (b.hasTrump()) {
                return new Bid_1.Bid(b.value, b.trump, secret);
            }
            else if (b.isPass()) {
                return new Bid_1.Pass(secret);
            }
            else if (b.isDouble()) {
                return new Bid_1.Double(secret);
            }
            else if (b.isRedouble()) {
                return new Bid_1.Redouble(secret);
            }
            return null;
        }
        static makeBid(bidSize, suit, clone) {
            let bid;
            const t = (typeof suit === 'string') ? suit : suit.toString();
            if (t.toUpperCase() === Bid_1.PASS) {
                bid = this.PASS;
            }
            else if (t.toUpperCase() === Bid_1.DOUBLE) {
                bid = this.DOUBLE;
            }
            else {
                const numbers = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN"];
                bid = this[`${numbers[bidSize]}_${t.toUpperCase()}`];
            }
            if (!bid)
                throw new Error(`Cannot find requested bid (${bidSize}, ${t})`);
            return clone ? this.cloneBid(bid) : bid;
        }
        static toUniversal(bid) {
            if (bid.isPass())
                return '-';
            if (bid.isDouble())
                return 'D';
            if (bid.isRedouble())
                return 'R';
            return `${bid.value}${SuitCollection_1.SuitCollection.toUniversal(bid.trump)}`;
        }
        static fromUniversal(value) {
            // eslint-disable-next-line
            let result, furtherInfo;
            switch (value) {
                case '-':
                    return this.PASS;
                case 'D':
                    return this.DOUBLE;
                case 'R':
                    return this.REDOUBLE;
                default:
                    try {
                        if (value.endsWith('NT'))
                            result = BidCollection.makeBid(parseInt(value[0], 10), NoTrump_3.NoTrump, false);
                        else
                            result = BidCollection.makeBid(parseInt(value[0], 10), SuitCollection_1.SuitCollection.get(value[1]), false);
                    }
                    catch (e) {
                        furtherInfo = e && e.message;
                    }
                    if (result)
                        return result;
                    throw new Error(`Unable to parse bid ${value}`);
            }
        }
    }
    exports.BidCollection = BidCollection;
    BidCollection.PASS = new Bid_1.Pass(secret);
    BidCollection.DOUBLE = new Bid_1.Double(secret);
    BidCollection.REDOUBLE = new Bid_1.Redouble(secret);
    BidCollection.ONE_NOTRUMP = new Bid_1.Bid(1, NoTrump_3.NoTrump, secret);
    BidCollection.ONE_SPADES = new Bid_1.Bid(1, SuitValues_3.Spades, secret);
    BidCollection.ONE_HEARTS = new Bid_1.Bid(1, SuitValues_3.Hearts, secret);
    BidCollection.ONE_DIAMONDS = new Bid_1.Bid(1, SuitValues_3.Diamonds, secret);
    BidCollection.ONE_CLUBS = new Bid_1.Bid(1, SuitValues_3.Clubs, secret);
    BidCollection.TWO_NOTRUMP = new Bid_1.Bid(2, NoTrump_3.NoTrump, secret);
    BidCollection.TWO_SPADES = new Bid_1.Bid(2, SuitValues_3.Spades, secret);
    BidCollection.TWO_HEARTS = new Bid_1.Bid(2, SuitValues_3.Hearts, secret);
    BidCollection.TWO_DIAMONDS = new Bid_1.Bid(2, SuitValues_3.Diamonds, secret);
    BidCollection.TWO_CLUBS = new Bid_1.Bid(2, SuitValues_3.Clubs, secret);
    BidCollection.THREE_NOTRUMP = new Bid_1.Bid(3, NoTrump_3.NoTrump, secret);
    BidCollection.THREE_SPADES = new Bid_1.Bid(3, SuitValues_3.Spades, secret);
    BidCollection.THREE_HEARTS = new Bid_1.Bid(3, SuitValues_3.Hearts, secret);
    BidCollection.THREE_DIAMONDS = new Bid_1.Bid(3, SuitValues_3.Diamonds, secret);
    BidCollection.THREE_CLUBS = new Bid_1.Bid(3, SuitValues_3.Clubs, secret);
    BidCollection.FOUR_NOTRUMP = new Bid_1.Bid(4, NoTrump_3.NoTrump, secret);
    BidCollection.FOUR_SPADES = new Bid_1.Bid(4, SuitValues_3.Spades, secret);
    BidCollection.FOUR_HEARTS = new Bid_1.Bid(4, SuitValues_3.Hearts, secret);
    BidCollection.FOUR_DIAMONDS = new Bid_1.Bid(4, SuitValues_3.Diamonds, secret);
    BidCollection.FOUR_CLUBS = new Bid_1.Bid(4, SuitValues_3.Clubs, secret);
    BidCollection.FIVE_NOTRUMP = new Bid_1.Bid(5, NoTrump_3.NoTrump, secret);
    BidCollection.FIVE_SPADES = new Bid_1.Bid(5, SuitValues_3.Spades, secret);
    BidCollection.FIVE_HEARTS = new Bid_1.Bid(5, SuitValues_3.Hearts, secret);
    BidCollection.FIVE_DIAMONDS = new Bid_1.Bid(5, SuitValues_3.Diamonds, secret);
    BidCollection.FIVE_CLUBS = new Bid_1.Bid(5, SuitValues_3.Clubs, secret);
    BidCollection.SIX_NOTRUMP = new Bid_1.Bid(6, NoTrump_3.NoTrump, secret);
    BidCollection.SIX_SPADES = new Bid_1.Bid(6, SuitValues_3.Spades, secret);
    BidCollection.SIX_HEARTS = new Bid_1.Bid(6, SuitValues_3.Hearts, secret);
    BidCollection.SIX_DIAMONDS = new Bid_1.Bid(6, SuitValues_3.Diamonds, secret);
    BidCollection.SIX_CLUBS = new Bid_1.Bid(6, SuitValues_3.Clubs, secret);
    BidCollection.SEVEN_NOTRUMP = new Bid_1.Bid(7, NoTrump_3.NoTrump, secret);
    BidCollection.SEVEN_SPADES = new Bid_1.Bid(7, SuitValues_3.Spades, secret);
    BidCollection.SEVEN_HEARTS = new Bid_1.Bid(7, SuitValues_3.Hearts, secret);
    BidCollection.SEVEN_DIAMONDS = new Bid_1.Bid(7, SuitValues_3.Diamonds, secret);
    BidCollection.SEVEN_CLUBS = new Bid_1.Bid(7, SuitValues_3.Clubs, secret);
    BidCollection.ONE_NOTRUMP_C = () => new Bid_1.Bid(1, NoTrump_3.NoTrump, secret);
    BidCollection.ONE_SPADES_C = () => new Bid_1.Bid(1, SuitValues_3.Spades, secret);
    BidCollection.ONE_HEARTS_C = () => new Bid_1.Bid(1, SuitValues_3.Hearts, secret);
    BidCollection.ONE_DIAMONDS_C = () => new Bid_1.Bid(1, SuitValues_3.Diamonds, secret);
    BidCollection.ONE_CLUBS_C = () => new Bid_1.Bid(1, SuitValues_3.Clubs, secret);
    BidCollection.TWO_NOTRUMP_C = () => new Bid_1.Bid(2, NoTrump_3.NoTrump, secret);
    BidCollection.TWO_SPADES_C = () => new Bid_1.Bid(2, SuitValues_3.Spades, secret);
    BidCollection.TWO_HEARTS_C = () => new Bid_1.Bid(2, SuitValues_3.Hearts, secret);
    BidCollection.TWO_DIAMONDS_C = () => new Bid_1.Bid(2, SuitValues_3.Diamonds, secret);
    BidCollection.TWO_CLUBS_C = () => new Bid_1.Bid(2, SuitValues_3.Clubs, secret);
    BidCollection.THREE_NOTRUMP_C = () => new Bid_1.Bid(3, NoTrump_3.NoTrump, secret);
    BidCollection.THREE_SPADES_C = () => new Bid_1.Bid(3, SuitValues_3.Spades, secret);
    BidCollection.THREE_HEARTS_C = () => new Bid_1.Bid(3, SuitValues_3.Hearts, secret);
    BidCollection.THREE_DIAMONDS_C = () => new Bid_1.Bid(3, SuitValues_3.Diamonds, secret);
    BidCollection.THREE_CLUBS_C = () => new Bid_1.Bid(3, SuitValues_3.Clubs, secret);
    BidCollection.FOUR_NOTRUMP_C = () => new Bid_1.Bid(4, NoTrump_3.NoTrump, secret);
    BidCollection.FOUR_SPADES_C = () => new Bid_1.Bid(4, SuitValues_3.Spades, secret);
    BidCollection.FOUR_HEARTS_C = () => new Bid_1.Bid(4, SuitValues_3.Hearts, secret);
    BidCollection.FOUR_DIAMONDS_C = () => new Bid_1.Bid(4, SuitValues_3.Diamonds, secret);
    BidCollection.FOUR_CLUBS_C = () => new Bid_1.Bid(4, SuitValues_3.Clubs, secret);
    BidCollection.FIVE_NOTRUMP_C = () => new Bid_1.Bid(5, NoTrump_3.NoTrump, secret);
    BidCollection.FIVE_SPADES_C = () => new Bid_1.Bid(5, SuitValues_3.Spades, secret);
    BidCollection.FIVE_HEARTS_C = () => new Bid_1.Bid(5, SuitValues_3.Hearts, secret);
    BidCollection.FIVE_DIAMONDS_C = () => new Bid_1.Bid(5, SuitValues_3.Diamonds, secret);
    BidCollection.FIVE_CLUBS_C = () => new Bid_1.Bid(5, SuitValues_3.Clubs, secret);
    BidCollection.SIX_NOTRUMP_C = () => new Bid_1.Bid(6, NoTrump_3.NoTrump, secret);
    BidCollection.SIX_SPADES_C = () => new Bid_1.Bid(6, SuitValues_3.Spades, secret);
    BidCollection.SIX_HEARTS_C = () => new Bid_1.Bid(6, SuitValues_3.Hearts, secret);
    BidCollection.SIX_DIAMONDS_C = () => new Bid_1.Bid(6, SuitValues_3.Diamonds, secret);
    BidCollection.SIX_CLUBS_C = () => new Bid_1.Bid(6, SuitValues_3.Clubs, secret);
    BidCollection.SEVEN_NOTRUMP_C = () => new Bid_1.Bid(7, NoTrump_3.NoTrump, secret);
    BidCollection.SEVEN_SPADES_C = () => new Bid_1.Bid(7, SuitValues_3.Spades, secret);
    BidCollection.SEVEN_HEARTS_C = () => new Bid_1.Bid(7, SuitValues_3.Hearts, secret);
    BidCollection.SEVEN_DIAMONDS_C = () => new Bid_1.Bid(7, SuitValues_3.Diamonds, secret);
    BidCollection.SEVEN_CLUBS_C = () => new Bid_1.Bid(7, SuitValues_3.Clubs, secret);
});
define("core/bidding/Call", ["require", "exports", "core/Direction"], function (require, exports, Direction_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Call = void 0;
    class Call {
        constructor(b, d) {
            this.bid = b;
            this.direction = d;
        }
        getBid() {
            return this.bid;
        }
        getDirection() {
            return this.direction;
        }
        toString() {
            return `${this.direction}: ${this.bid}`;
        }
        toAltString() {
            return `${this.bid.toString().replace(' ', '').substr(0, 2)}${this.bid.toString()[2] === 'N' ? 'T' : ''} by ${Direction_1.DirectionCollection.toUniversalFromDirection(this.direction.getValue())}`;
        }
        getTrump() {
            return this.bid.trump;
        }
        isPass() {
            return this.bid.isPass();
        }
        pairMatches(candidate) {
            if (this.direction.equals(candidate) || this.direction.opposite().equals(candidate)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    exports.Call = Call;
});
define("core/bidding/Vulnerability", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Vulnerability = void 0;
    class Vulnerability {
        constructor(declarerVulnerable, defenderVulnerable) {
            this.declarerVulnerable = declarerVulnerable;
            this.defenderVulnerable = defenderVulnerable;
        }
        isDeclarerVulnerable() {
            return this.declarerVulnerable;
        }
        isDefenderVulnerable() {
            return this.defenderVulnerable;
        }
    }
    exports.Vulnerability = Vulnerability;
});
define("core/bidding/Auctioneer", ["require", "exports", "core/Direction", "core/utility/HashSet", "core/bidding/BidCollection", "core/bidding/Call", "core/bidding/Vulnerability"], function (require, exports, Direction_2, HashSet_1, BidCollection_1, Call_1, Vulnerability_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Auctioneer = void 0;
    class Auctioneer {
        constructor(firstToBid) {
            this.nextToBid = firstToBid;
            this.bidCount = 0;
            this.passCount = 0;
            this.last = null;
            this.beforeLast = null;
            this.highBid = null;
            this.vulnerability = new Vulnerability_1.Vulnerability(false, false);
            this.calls = [];
        }
        setVulnerability(v) {
            this.vulnerability = v;
        }
        getVulnerabilityIndex() {
            let result = 0;
            if (this.nextToBid.getValue() == Direction_2.Direction.NORTH || this.nextToBid.getValue() == Direction_2.Direction.SOUTH) {
                result += this.vulnerability.isDeclarerVulnerable() ? 2 : 0;
                result += this.vulnerability.isDefenderVulnerable() ? 1 : 0;
            }
            else {
                result += this.vulnerability.isDefenderVulnerable() ? 2 : 0;
                result += this.vulnerability.isDeclarerVulnerable() ? 1 : 0;
            }
            return result;
        }
        getCalls() {
            return this.calls.slice();
        }
        bid(b) {
            const bid = BidCollection_1.BidCollection.cloneBid(b);
            this.beforeLast = this.last;
            this.last = new Call_1.Call(bid, this.nextToBid);
            this.calls.push(this.last);
            this.bidCount++;
            if (bid.isPass()) {
                this.passCount++;
            }
            else {
                this.passCount = 0;
                if (bid.isRedoubled()) {
                    this.getHighBid().makeRedoubled();
                }
                if (bid.isDouble()) {
                    this.getHighBid().makeDoubled();
                }
                else {
                    this.highBid = bid;
                }
            }
            this.nextToBid = this.nextToBid.clockwise();
        }
        biddingFinished() {
            return (this.passCount === 3 && this.highBid != null) || this.passCount === 4;
        }
        getHighBid() {
            return this.highBid;
        }
        isOpeningBid() {
            return !this.calls.reduce((acc, call) => acc || !call.isPass(), false);
        }
        getPartnersLastCall() {
            return this.beforeLast;
        }
        getPartnersCall(playerCall) {
            const current = this.calls.indexOf(playerCall);
            if (current >= 2) {
                return this.calls[current - 2];
            }
            else {
                return null;
            }
        }
        getLastCall() {
            return this.last;
        }
        isValid(candidate) {
            let result = false;
            if (candidate != null) {
                if (candidate.equals(BidCollection_1.BidCollection.DOUBLE)) {
                    if (this.getHighCall() != null && !this.getHighCall().pairMatches(this.nextToBid) && !this.getHighBid().isDoubled()) {
                        return true;
                    }
                }
                else if (candidate.isPass() || candidate.greaterThan(this.getHighBid())) {
                    result = true;
                }
            }
            return result;
        }
        getDummy() {
            if (this.biddingFinished() && this.getHighCall() !== null) {
                const firstCall = this.calls.find((call) => {
                    return call.getBid().hasTrump() && call.getTrump() === this.getHighCall().getTrump() &&
                        call.pairMatches(this.getHighCall().getDirection());
                });
                if (firstCall)
                    return firstCall.getDirection().opposite();
            }
            return null;
        }
        getHighCall() {
            return this.calls.find(c => c.getBid().equals(this.highBid));
        }
        enemyCallBeforePartner(myBid) {
            let myOrder;
            if (myBid == null) {
                myOrder = this.bidCount;
            }
            else {
                myOrder = this.getCallOrderZeroBased(myBid);
            }
            return this.getDirectEnemyCall(myOrder - 2);
        }
        getDirectEnemyCall(callOrder) {
            let enemyCall = this.calls[callOrder - 1];
            if (enemyCall.isPass()) {
                enemyCall = this.calls[callOrder - 3];
            }
            return enemyCall;
        }
        getDummyOffsetDirection(original) {
            let d = this.getDummy();
            let offset = original;
            for (let i = 0; i < 4; i++) {
                if (d === Direction_2.DirectionCollection.NORTH_INSTANCE) {
                    break;
                }
                else {
                    d = d.clockwise();
                    offset = offset.clockwise();
                }
            }
            return offset;
        }
        may2ndOvercall() {
            if (this.bidCount === 0 || this.bidCount > 6) {
                return false;
            }
            let opening = this.calls[this.bidCount - 1].getBid();
            if (opening.value === 1) {
                if (this.bidCount >= 3) {
                    if (!this.calls[this.bidCount - 3].isPass()) {
                        opening = this.calls[this.bidCount - 3].getBid();
                    }
                }
                return this.isOpening(opening);
            }
            return false;
        }
        may4thOvercall() {
            if (this.passCount !== 2 || this.bidCount < 3 || this.bidCount > 6) {
                return false;
            }
            const opening = this.calls[this.bidCount - 3].getBid();
            if (this.isOpening(opening) && opening.value === 1) {
                return true;
            }
            return false;
        }
        getCallOrderZeroBased(bid) {
            return this.calls.findIndex(c => c.getBid().equals(bid));
        }
        OvercallIndex(bid) {
            if (bid.equals(BidCollection_1.BidCollection.PASS))
                return 0;
            let countPass = 0;
            let callOrder = this.getCallOrderZeroBased(bid);
            if (this.isOpening(this.calls[callOrder].getBid())) {
                return 0;
            }
            let ourBid = false;
            let getOut = false;
            while (callOrder !== 0 && !getOut) {
                callOrder--;
                const call = this.calls[callOrder];
                if (!call.isPass()) {
                    if (ourBid) {
                        countPass = -1;
                        getOut = true;
                    }
                    else if (this.isOpening(call.getBid())) {
                        getOut = true;
                    }
                    if (!getOut && callOrder >= 2) {
                        if (this.calls[callOrder - 1].isPass() && this.isOpening(this.calls[callOrder - 2].getBid())) {
                            getOut = true;
                        }
                        else {
                            countPass = -1;
                            getOut = true;
                        }
                    }
                    getOut = true;
                }
                if (!getOut) {
                    countPass++;
                    ourBid = !ourBid;
                }
            }
            if (countPass === 0) {
                return 1;
            }
            else if (countPass === 2) {
                return -1;
            }
            else {
                return 0;
            }
        }
        isOvercall(bid) {
            return this.OvercallIndex(bid) !== 0;
        }
        isFourthOvercall(bid) {
            return this.OvercallIndex(bid) == -1;
        }
        getEnemyTrumps() {
            const result = new HashSet_1.HashSet();
            const reversedCalls = this.getCalls().reverse();
            let enemyBid = true;
            reversedCalls.forEach((call) => {
                if (call.getBid().hasTrump() && enemyBid) {
                    result.add(call.getTrump());
                }
                enemyBid = !enemyBid;
            });
            return result;
        }
        biddingSequenceLength() {
            const reversedCalls = this.getCalls().reverse();
            let ourBid = false;
            let seqLength = 0;
            for (let i = 0; i < reversedCalls.length; i++) {
                if (ourBid) {
                    const call = reversedCalls[i];
                    if (call.getBid().hasTrump()) {
                        seqLength++;
                    }
                    else {
                        return seqLength;
                    }
                }
                ourBid = !ourBid;
            }
            return seqLength;
        }
        isOpening(bidWithTrump) {
            const index = this.getCallOrderZeroBased(bidWithTrump);
            if (index > 3) {
                return false;
            }
            if (index === 0) {
                return true;
            }
            if (index === 1 && this.calls[0].isPass()) {
                return true;
            }
            if (index === 2 && this.calls[0].isPass() && this.calls[1].isPass()) {
                return true;
            }
            if (index === 3 && this.calls[0].isPass() && this.calls[1].isPass() && this.calls[2].isPass()) {
                return true;
            }
            return false;
        }
    }
    exports.Auctioneer = Auctioneer;
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
define("core/Card", ["require", "exports", "core/deck/CardValues", "core/deck/SuitCollection", "core/deck/SuitValues"], function (require, exports, CardValues_1, SuitCollection_2, SuitValues_4) {
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
            return this.value + SuitCollection_2.SuitCollection.getIndex(this.denomination) * (Card.ACE + 1);
        }
        getUniversal() {
            if (this.denomination === SuitValues_4.Spades) {
                return Card.valueToString(this.value) + "S";
            }
            else if (this.denomination === SuitValues_4.Hearts) {
                return Card.valueToString(this.value) + "H";
            }
            else if (this.denomination === SuitValues_4.Diamonds) {
                return Card.valueToString(this.value) + "D";
            }
            else if (this.denomination === SuitValues_4.Clubs) {
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
            const suit = SuitCollection_2.SuitCollection.get(card.toUpperCase().substring(1, 2));
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
define("core/Hand", ["require", "exports", "core/Card", "core/deck/SuitCollection"], function (require, exports, Card_2, SuitCollection_3) {
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
            return new Hand(colorSuits.reduce((acc, colorSuitStr, i) => acc.concat(this.createCards(colorSuitStr, SuitCollection_3.SuitCollection.list[i])), []));
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
            const orderedCards = SuitCollection_3.SuitCollection.list.reduce((acc, color) => {
                return acc.concat(this.getSuitHi2Low(color));
            }, []);
            this.orderedCards = orderedCards;
            return orderedCards.slice();
        }
        getLongestSuit() {
            let longest = 0;
            let result = null;
            SuitCollection_3.SuitCollection.list.forEach((suit) => {
                const curLength = this.getSuitLength(suit);
                if (longest < curLength) {
                    longest = curLength;
                    result = suit;
                }
            });
            return result;
        }
        getLongestColorLength() {
            return SuitCollection_3.SuitCollection.list.reduce((acc, color) => Math.max(acc, this.getSuitLength(color)), 0);
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
            const suitLengths = SuitCollection_3.SuitCollection.list.map(color => this.getSuitLength(color));
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
            return SuitCollection_3.SuitCollection.mmList.filter((suit) => this.getSuitLength(suit) >= minimumSuitLength);
        }
        getSuitsWithCardCount(suitLength) {
            return SuitCollection_3.SuitCollection.list.filter((suit) => this.getSuitLength(suit) === suitLength);
        }
        getGood5LengthSuits() {
            return SuitCollection_3.SuitCollection.list.filter(suit => this.isGood5LengthSuits(suit));
        }
        isGood5LengthSuits(suit) {
            const cardsInSuit = this.getSuitHi2Low(suit);
            return cardsInSuit.length >= 5 && (this.isAtLeastAQJXX(cardsInSuit) || this.isAtLeastKQTXX(cardsInSuit));
        }
        getDecent5LengthSuits() {
            return SuitCollection_3.SuitCollection.list.filter(s => this.isDecent5LengthSuits(s));
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
define("core/bidding/rules/BiddingRule", ["require", "exports"], function (require, exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BiddingRule = void 0;
    class BiddingRule {
        constructor(a, h) {
            this.auction = a;
            this.hand = h;
        }
        getBid() {
            if (!this.applies()) {
                return null;
            }
            const candidate = this.prepareBid();
            if (this.auction == null || this.auction.isValid(candidate)) {
                return candidate;
            }
            else {
                return null;
            }
        }
        haveStopperInEnemySuit() {
            const enemyTrumps = this.auction.getEnemyTrumps();
            return !enemyTrumps.asArray().find((trump) => {
                if (trump.isNoTrump()) {
                    return true;
                }
                if (!this.hand.haveStopper(trump)) {
                    return true;
                }
            });
        }
    }
    exports.BiddingRule = BiddingRule;
});
define("core/bidding/rules/AlwaysPass", ["require", "exports", "core/bidding/BidCollection", "core/bidding/rules/BiddingRule"], function (require, exports, BidCollection_2, BiddingRule_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlwaysPass = void 0;
    class AlwaysPass extends BiddingRule_1.BiddingRule {
        constructor() {
            super(null, null);
        }
        prepareBid() {
            return BidCollection_2.BidCollection.PASS;
        }
        applies() {
            return true;
        }
    }
    exports.AlwaysPass = AlwaysPass;
});
define("core/bidding/PointCalculator", ["require", "exports", "core/deck/CardValues", "core/deck/SuitCollection"], function (require, exports, CardValues_2, SuitCollection_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PointCalculator = void 0;
    class PointCalculator {
        constructor(hand) {
            this.hand = hand;
        }
        getHighCardPoints(cards) {
            let highCardPoints = 0;
            if (!cards)
                cards = this.hand.cards;
            cards.forEach((card) => {
                if (CardValues_2.Ace.isValueOf(card)) {
                    highCardPoints += 4;
                }
                else if (CardValues_2.King.isValueOf(card)) {
                    highCardPoints += 3;
                }
                else if (CardValues_2.Queen.isValueOf(card)) {
                    highCardPoints += 2;
                }
                else if (CardValues_2.Jack.isValueOf(card)) {
                    highCardPoints += 1;
                }
            });
            return highCardPoints;
        }
        getDistributionalPoints() {
            let result = 0;
            SuitCollection_4.SuitCollection.list.forEach((suit) => {
                result += this.distributionalValueForCardsInSuit(suit);
            });
            return result;
        }
        distributionalValueForCardsInSuit(suit) {
            const cardsInColor = this.hand.getSuitHi2Low(suit);
            const cardsCount = cardsInColor.length;
            let result = 0;
            if (cardsCount == 0) {
                result = 3;
            }
            else if (cardsCount == 1) {
                result = 2;
            }
            else if (cardsCount == 2) {
                result = 1;
            }
            return result;
        }
        getCombinedPoints() {
            let result = 0;
            SuitCollection_4.SuitCollection.list.forEach((color) => {
                const cardsInColor = this.hand.getSuitHi2Low(color);
                result += this.getHighCardPoints(cardsInColor);
                if (!this.isFlawed(cardsInColor)) {
                    result += this.distributionalValueForCardsInSuit(color);
                }
            });
            return result;
        }
        isFlawed(cardsInColor) {
            if (cardsInColor.length == 1) {
                if (this.isKorQorJ(cardsInColor[0])) {
                    return true;
                }
            }
            else if (cardsInColor.length == 2) {
                if (CardValues_2.King.isValueOf(cardsInColor[0]) && this.isQorJ(cardsInColor[1])) {
                    return true;
                }
                else if (this.isQorJ(cardsInColor[0])) {
                    return true;
                }
            }
            return false;
        }
        isKorQorJ(card) {
            return CardValues_2.King.isValueOf(card) || this.isQorJ(card);
        }
        isQorJ(card) {
            return CardValues_2.Queen.isValueOf(card) || CardValues_2.Jack.isValueOf(card);
        }
        isBalanced() {
            let doubletons = 0;
            let singletons = false;
            let voids = false;
            SuitCollection_4.SuitCollection.list.forEach((color) => {
                const cardsInColor = this.hand.getSuitLength(color);
                if (cardsInColor == 0) {
                    voids = true;
                }
                else if (cardsInColor == 1) {
                    singletons = true;
                }
                else if (cardsInColor == 2) {
                    doubletons++;
                }
            });
            if (doubletons >= 2 || singletons || voids) {
                return false;
            }
            else {
                return true;
            }
        }
        isSemiBalanced() {
            let singletons = false;
            let voids = false;
            SuitCollection_4.SuitCollection.list.forEach((color) => {
                const cardsInColor = this.hand.getSuitLength(color);
                if (cardsInColor == 0) {
                    voids = true;
                }
                else if (cardsInColor == 1) {
                    singletons = true;
                }
            });
            if (singletons || voids) {
                return false;
            }
            else {
                return true;
            }
        }
        isTame() {
            if (this.hand.matchesSuitLengthsLongToShort(4, 4, 4, 1)) {
                return true;
            }
            if (this.hand.matchesSuitLengthsLongToShort(5, 4, 2, 2)) {
                return true;
            }
            if (this.hand.matchesSuitLengthsLongToShort(5, 4, 3, 1)) {
                return true;
            }
            if (this.hand.matchesSuitLengthsLongToShort(6, 3, 2, 2)) {
                return true;
            }
            if (this.hand.matchesSuitLengthsLongToShort(6, 3, 3, 1)) {
                return true;
            }
            return false;
        }
    }
    exports.PointCalculator = PointCalculator;
});
define("core/bidding/rules/Open1Color", ["require", "exports", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, SuitCollection_5, SuitValues_5, BidCollection_3, PointCalculator_1, BiddingRule_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Open1Color = void 0;
    class Open1Color extends BiddingRule_2.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_1.PointCalculator(this.hand);
        }
        applies() {
            return this.auction.isOpeningBid() && this.pc.getCombinedPoints() >= 13;
        }
        prepareBid() {
            let result = null;
            let highest = null;
            SuitCollection_5.SuitCollection.list.forEach((color) => {
                if (this.hand.getSuitLength(color) >= 5) {
                    if (this.hand.AisStronger(color, highest)) {
                        highest = color;
                    }
                }
            });
            if (highest != null) {
                result = BidCollection_3.BidCollection.makeBid(1, highest, true);
            }
            else {
                result = BidCollection_3.BidCollection.makeBid(1, this.getStrongerMinor(), true);
            }
            return result;
        }
        getStrongerMinor() {
            let result = null;
            if (this.hand.getSuitLength(SuitValues_5.Clubs) > this.hand.getSuitLength(SuitValues_5.Diamonds)) {
                result = SuitValues_5.Clubs;
            }
            else if (this.hand.getSuitLength(SuitValues_5.Clubs) == 3 && this.hand.getSuitLength(SuitValues_5.Diamonds) == 3) {
                if (this.pc.getHighCardPoints(this.hand.getSuitHi2Low(SuitValues_5.Clubs)) > this.pc.getHighCardPoints(this.hand.getSuitHi2Low(SuitValues_5.Diamonds))) {
                    result = SuitValues_5.Clubs;
                }
                else {
                    result = SuitValues_5.Diamonds;
                }
            }
            else {
                result = SuitValues_5.Diamonds;
            }
            return result;
        }
    }
    exports.Open1Color = Open1Color;
});
define("core/bidding/rules/Open1NT", ["require", "exports", "core/deck/NoTrump", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, NoTrump_4, BidCollection_4, PointCalculator_2, BiddingRule_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Open1NT = void 0;
    class Open1NT extends BiddingRule_3.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_2.PointCalculator(this.hand);
        }
        prepareBid() {
            return BidCollection_4.BidCollection.makeBid(1, NoTrump_4.NoTrump, true);
        }
        applies() {
            return this.auction.isOpeningBid() && this.pc.getHighCardPoints() >= 15 && this.pc.getHighCardPoints() <= 17 && this.pc.isBalanced();
        }
    }
    exports.Open1NT = Open1NT;
});
define("core/bidding/rules/Open2NT", ["require", "exports", "core/deck/NoTrump", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, NoTrump_5, BidCollection_5, PointCalculator_3, BiddingRule_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Open2NT = void 0;
    class Open2NT extends BiddingRule_4.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_3.PointCalculator(this.hand);
        }
        prepareBid() {
            return BidCollection_5.BidCollection.makeBid(2, NoTrump_5.NoTrump, true);
        }
        applies() {
            return this.auction.isOpeningBid() && this.pc.getHighCardPoints() >= 20 && this.pc.getHighCardPoints() <= 21 && this.pc.isBalanced();
        }
    }
    exports.Open2NT = Open2NT;
});
define("core/bidding/rules/Overcall1NT", ["require", "exports", "core/deck/NoTrump", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, NoTrump_6, BidCollection_6, PointCalculator_4, BiddingRule_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Overcall1NT = void 0;
    class Overcall1NT extends BiddingRule_5.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_4.PointCalculator(this.hand);
        }
        applies() {
            return ((this.auction.may2ndOvercall() && this.pc.getHighCardPoints() >= 15 && this.pc.getHighCardPoints() <= 18)
                || (this.auction.may4thOvercall() && this.pc.getHighCardPoints() >= 12 && this.pc.getHighCardPoints() <= 15))
                && this.pc.isBalanced() && this.haveStopperInEnemySuit();
        }
        prepareBid() {
            return BidCollection_6.BidCollection.makeBid(1, NoTrump_6.NoTrump, true);
        }
    }
    exports.Overcall1NT = Overcall1NT;
});
define("core/bidding/rules/OvercallSuit", ["require", "exports", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule", "core/bidding/BidCollection"], function (require, exports, PointCalculator_5, BiddingRule_6, BidCollection_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.OvercallSuit = void 0;
    class OvercallSuit extends BiddingRule_6.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.isFourthOvercall = false;
            this.pc = new PointCalculator_5.PointCalculator(this.hand);
        }
        applies() {
            if (this.pc.getCombinedPoints() >= 8) {
                if (this.auction.may2ndOvercall()) {
                    return true;
                }
                else if (this.auction.may4thOvercall()) {
                    this.isFourthOvercall = true;
                    return true;
                }
            }
            return false;
        }
        prepareBid() {
            const points = this.pc.getCombinedPoints();
            if (points < 11) {
                return this.firstValidBid(this.bidSuit(1, this.hand.getSuitsWithAtLeastCards(6)), this.bidSuit(1, this.hand.getDecent5LengthSuits()));
            }
            if ((points >= 11 && points <= 17) || (this.isFourthOvercall && points >= 8 && points <= 14)) {
                return this.firstValidBid(this.bidSuit(1, this.hand.getSuitsWithAtLeastCards(5)), this.bidSuit(2, this.hand.getSuitsWithAtLeastCards(6)), this.bidSuit(2, this.hand.getGood5LengthSuits()));
            }
            return null;
        }
        bidSuit(bidLevel, suits) {
            let result = null;
            suits.forEach((suit) => {
                if (!result && this.auction.isValid(BidCollection_7.BidCollection.makeBid(bidLevel, suit, false))) {
                    result = BidCollection_7.BidCollection.makeBid(bidLevel, suit, true);
                }
            });
            return result;
        }
        firstValidBid(...bids) {
            return bids.find((bid) => bid);
        }
    }
    exports.OvercallSuit = OvercallSuit;
});
define("core/bidding/rules/PartnersRebid", ["require", "exports", "core/bidding/rules/BiddingRule"], function (require, exports, BiddingRule_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PartnersRebid = void 0;
    class PartnersRebid extends BiddingRule_7.BiddingRule {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (this.auction.biddingSequenceLength() === 3) {
                let getCall = this.auction.getPartnersLastCall();
                this.rebid = getCall.getBid();
                getCall = this.auction.getPartnersCall(getCall);
                this.response = getCall.getBid();
                this.opening = this.auction.getPartnersCall(getCall).getBid();
                return true;
            }
            return false;
        }
    }
    exports.PartnersRebid = PartnersRebid;
});
define("core/bidding/rules/PRebidAfter1NT", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/PartnersRebid"], function (require, exports, NoTrump_7, SuitValues_6, BidCollection_8, PointCalculator_6, PartnersRebid_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PRebidAfter1NT = void 0;
    class PRebidAfter1NT extends PartnersRebid_1.PartnersRebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (super.applies()) {
                return this.rebid.equals(BidCollection_8.BidCollection.ONE_NOTRUMP);
            }
            return false;
        }
        prepareBid() {
            const pc = new PointCalculator_6.PointCalculator(this.hand);
            const points = pc.getCombinedPoints();
            if (this.response.trump.isMinorSuit()) {
                if (points >= 11) {
                    if (points >= 13) {
                        if (this.hand.getSuitLength(SuitValues_6.Diamonds) == 4) {
                            if (this.hand.getSuitLength(SuitValues_6.Hearts) >= 5) {
                                return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Hearts, true);
                            }
                            else if (this.hand.getSuitLength(SuitValues_6.Spades) >= 5) {
                                return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Spades, true);
                            }
                        }
                    }
                    if (this.hand.getSuitLength(SuitValues_6.Diamonds) >= 5) {
                        if (this.hand.getSuitLength(SuitValues_6.Diamonds) != 5) {
                            return BidCollection_8.BidCollection.makeBid(3, SuitValues_6.Diamonds, true);
                        }
                        else if (this.hand.getSuitLength(SuitValues_6.Clubs) >= 4) {
                            return BidCollection_8.BidCollection.makeBid(3, SuitValues_6.Clubs, true);
                        }
                    }
                    if (pc.isSemiBalanced()) {
                        return BidCollection_8.BidCollection.makeBid(2, NoTrump_7.NoTrump, true);
                    }
                }
                if (this.hand.getSuitLength(SuitValues_6.Diamonds) >= 6) {
                    return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Diamonds, true);
                }
                else if (this.hand.getSuitLength(SuitValues_6.Clubs) >= 3) {
                    return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Clubs, true);
                }
            }
            else {
                const hearts = this.hand.getSuitLength(SuitValues_6.Hearts);
                const spades = this.hand.getSuitLength(SuitValues_6.Spades);
                if (points <= 10) {
                    if (this.response.trump === SuitValues_6.Spades) {
                        if (spades == 5 && hearts >= 4) {
                            return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Hearts, true);
                        }
                    }
                    else if (hearts >= 5) {
                        return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Hearts, true);
                    }
                    else if (spades >= 5) {
                        return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Spades, true);
                    }
                }
                else {
                    if (this.response.trump === SuitValues_6.Hearts) {
                        if (hearts >= 6) {
                            return BidCollection_8.BidCollection.makeBid(3, SuitValues_6.Hearts, true);
                        }
                        else if (spades == 4 && hearts == 4) {
                            return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Spades, true);
                        }
                    }
                    else if (spades >= 5) {
                        if (spades >= 6) {
                            return BidCollection_8.BidCollection.makeBid(3, SuitValues_6.Spades, true);
                        }
                        else {
                            return BidCollection_8.BidCollection.makeBid(2, SuitValues_6.Spades, true);
                        }
                    }
                    else if (pc.isSemiBalanced()) {
                        return BidCollection_8.BidCollection.makeBid(2, NoTrump_7.NoTrump, true);
                    }
                }
            }
            return null;
        }
    }
    exports.PRebidAfter1NT = PRebidAfter1NT;
});
define("core/bidding/rules/PRebidToCorrect", ["require", "exports", "core/deck/NoTrump", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/PartnersRebid"], function (require, exports, NoTrump_8, BidCollection_9, PointCalculator_7, PartnersRebid_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PRebidToCorrect = void 0;
    class PRebidToCorrect extends PartnersRebid_2.PartnersRebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (super.applies()) {
                if (this.rebid.trump !== NoTrump_8.NoTrump &&
                    this.rebid.trump !== this.response.trump &&
                    this.rebid.trump !== this.opening.trump &&
                    this.rebid === this.auction.getHighCall().getBid() &&
                    this.hand.getSuitLength(this.rebid.trump) <= 2) {
                    const pc = new PointCalculator_7.PointCalculator(this.hand);
                    const HCP = pc.getHighCardPoints();
                    if (HCP < 6)
                        return true;
                }
            }
            return false;
        }
        prepareBid() {
            if (this.auction.isValid(BidCollection_9.BidCollection.makeBid(this.rebid.value, this.opening.trump, false))) {
                return BidCollection_9.BidCollection.makeBid(this.rebid.value, this.opening.trump, true);
            }
            else if (this.rebid.value < 7 && this.auction.isValid(BidCollection_9.BidCollection.makeBid(this.rebid.value + 1, this.opening.trump, false))) {
                return BidCollection_9.BidCollection.makeBid(this.rebid.value + 1, this.opening.trump, true);
            }
            else {
                return BidCollection_9.BidCollection.PASS;
            }
        }
    }
    exports.PRebidToCorrect = PRebidToCorrect;
});
define("core/bidding/ResponseCalculator", ["require", "exports", "core/bidding/PointCalculator"], function (require, exports, PointCalculator_8) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ResponseCalculator = void 0;
    class ResponseCalculator extends PointCalculator_8.PointCalculator {
        constructor(hand, partnersBid) {
            super(hand);
            this.partnersBid = null;
            this.partnersBid = partnersBid;
        }
        distributionalValueForCardsInSuit(suit) {
            if (!this.partnersBidIsASuit()) {
                return super.distributionalValueForCardsInSuit(suit);
            }
            if (suit === this.partnersBid.trump) {
                return 0;
            }
            let result = super.distributionalValueForCardsInSuit(suit);
            if (4 <= this.hand.getSuitLength(this.partnersBid.trump)) {
                const colorLength = this.hand.getSuitLength(suit);
                if (colorLength == 0) {
                    result += 2;
                }
                else if (colorLength == 1) {
                    result += 1;
                }
            }
            return result;
        }
        partnersBidIsASuit() {
            return this.partnersBid.trump.isSuit();
        }
    }
    exports.ResponseCalculator = ResponseCalculator;
});
define("core/bidding/rules/PRebidWeakTwo", ["require", "exports", "core/bidding/ResponseCalculator", "core/bidding/rules/PartnersRebid", "core/bidding/BidCollection", "core/deck/NoTrump", "core/deck/SuitCollection", "core/deck/SuitValues"], function (require, exports, ResponseCalculator_1, PartnersRebid_3, BidCollection_10, NoTrump_9, SuitCollection_6, SuitValues_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PRebidWeakTwo = void 0;
    class PRebidWeakTwo extends PartnersRebid_3.PartnersRebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (super.applies()) {
                return this.opening.value == 2 && this.opening.trump !== SuitValues_7.Clubs && this.response.value == 2 && this.response.trump.isNoTrump() && this.rebid.value == 3;
            }
            return false;
        }
        prepareBid() {
            const open = this.opening.trump;
            const trump = this.rebid.trump;
            if (open === SuitValues_7.Diamonds) {
                if (trump.isNoTrump()) {
                    return null;
                }
                if (trump !== SuitValues_7.Diamonds) {
                    let result = null;
                    SuitCollection_6.SuitCollection.mmList.forEach((color) => {
                        if (!result && color !== trump && this.hand.isDecent5LengthSuits(color)) {
                            result = BidCollection_10.BidCollection.makeBid(3, color, true);
                            if (!this.auction.isValid(result)) {
                                result = BidCollection_10.BidCollection.makeBid(4, color, true);
                            }
                        }
                    });
                }
            }
            else {
                const calc = new ResponseCalculator_1.ResponseCalculator(this.hand, this.opening);
                if (trump.isNoTrump()) {
                    let allStopped = true;
                    SuitCollection_6.SuitCollection.list.forEach((color) => {
                        if (allStopped && color !== open && !this.hand.haveStrongStopper(color)) {
                            allStopped = false;
                        }
                    });
                    if (allStopped) {
                        return BidCollection_10.BidCollection.makeBid(3, NoTrump_9.NoTrump, true);
                    }
                }
                else if (trump === SuitValues_7.Spades) {
                    if (this.hand.getSuitLength(open) >= 2) {
                        return BidCollection_10.BidCollection.makeBid(4, open, true);
                    }
                    else if (calc.getHighCardPoints() >= 16) {
                        let allStopped = true;
                        SuitCollection_6.SuitCollection.list.forEach((color) => {
                            if (allStopped && color !== open && !this.hand.haveStrongStopper(color)) {
                                allStopped = false;
                            }
                        });
                        if (allStopped) {
                            return BidCollection_10.BidCollection.makeBid(3, NoTrump_9.NoTrump, true);
                        }
                    }
                    if (this.hand.getSuitLength(open) != 0) {
                        return BidCollection_10.BidCollection.makeBid(4, open, true);
                    }
                }
                else if (trump === SuitValues_7.Hearts) {
                    if (this.hand.getSuitLength(open) >= 2 && calc.getHighCardPoints(this.hand.getSuitHi2Low(open)) >= 4) {
                        return BidCollection_10.BidCollection.makeBid(4, open, true);
                    }
                    else {
                        return BidCollection_10.BidCollection.makeBid(3, open, true);
                    }
                }
                else {
                    return BidCollection_10.BidCollection.makeBid(3, open, true);
                }
            }
            return null;
        }
    }
    exports.PRebidWeakTwo = PRebidWeakTwo;
});
define("core/bidding/TrickCalculator", ["require", "exports", "core/Card", "core/deck/SuitCollection"], function (require, exports, Card_3, SuitCollection_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TrickCalculator = void 0;
    class TrickCalculator {
        constructor(hand) {
            this.hand = hand;
        }
        playingTricks() {
            let trickCount = 0;
            SuitCollection_7.SuitCollection.list.forEach((color) => {
                trickCount += this.doublePlayingTricks(color);
            });
            return trickCount / 2;
        }
        doublePlayingTricks(color) {
            let tricks = 0;
            const cards = this.hand.getSuitHi2Low(color);
            const length = cards.length;
            if (length >= 1) {
                if (cards[0].value == Card_3.Card.ACE)
                    tricks += 2;
                if (length >= 2) {
                    if (tricks == 2) {
                        if (cards[1].value == Card_3.Card.KING)
                            tricks += 2;
                        else if (cards[1].value == Card_3.Card.QUEEN)
                            tricks++;
                        if (length >= 3) {
                            if (tricks == 4) {
                                if (cards[2].value == Card_3.Card.QUEEN)
                                    tricks += 2;
                                else if (cards[2].value == Card_3.Card.JACK)
                                    tricks++;
                            }
                            else if (tricks == 3) {
                                if (cards[2].value == Card_3.Card.JACK)
                                    tricks += 2;
                                else if (cards[2].value == Card_3.Card.TEN)
                                    tricks++;
                            }
                            else if (cards[1].value == Card_3.Card.JACK) {
                                tricks += 1;
                            }
                        }
                    }
                    else if (cards[0].value == Card_3.Card.KING) {
                        if (cards[1].value == Card_3.Card.QUEEN || cards[1].value == Card_3.Card.JACK) {
                            if (length >= 3) {
                                if (cards[1].value == Card_3.Card.QUEEN)
                                    tricks += 3;
                                else if (cards[2].value == Card_3.Card.TEN)
                                    tricks += 3;
                            }
                            else if (cards[1].value == Card_3.Card.TEN) {
                                tricks += 2;
                            }
                        }
                    }
                    else if (cards[0].value == Card_3.Card.QUEEN) {
                        if (length >= 3) {
                            if (cards[1].value == Card_3.Card.JACK)
                                tricks += 2;
                            else
                                tricks++;
                        }
                    }
                    else if (cards[0].value == Card_3.Card.JACK && cards[1].value == Card_3.Card.TEN) {
                        tricks++;
                    }
                }
                if (length > 3) {
                    tricks += 2 * (length - 3);
                }
            }
            return tricks;
        }
    }
    exports.TrickCalculator = TrickCalculator;
});
define("core/bidding/rules/PreemptiveBid", ["require", "exports", "core/Card", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/TrickCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, Card_4, SuitValues_8, BidCollection_11, TrickCalculator_1, BiddingRule_8) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PreemptiveBid = void 0;
    class PreemptiveBid extends BiddingRule_8.BiddingRule {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (this.auction.isOpeningBid() || (this.auction.may2ndOvercall() || this.auction.may4thOvercall())) {
                const calc = new TrickCalculator_1.TrickCalculator(this.hand);
                this.longestSuit = this.hand.getLongestSuit();
                if (this.hand.getSuitLength(this.longestSuit) < 6) {
                    return false;
                }
                if (this.longestSuit !== SuitValues_8.Hearts && this.hand.getSuitLength(SuitValues_8.Hearts) >= 4 && this.hand.getSuitHi2Low(SuitValues_8.Hearts)[0].value >= Card_4.Card.QUEEN) {
                    return false;
                }
                if (this.longestSuit !== SuitValues_8.Spades && this.hand.getSuitLength(SuitValues_8.Spades) >= 4 && this.hand.getSuitHi2Low(SuitValues_8.Spades)[0].value >= Card_4.Card.QUEEN) {
                    return false;
                }
                let tricks = calc.playingTricks();
                const vulnerabilityIndex = this.auction.getVulnerabilityIndex();
                if (vulnerabilityIndex == 2) {
                    tricks += 2;
                }
                else if (vulnerabilityIndex == 1) {
                    tricks += 4;
                }
                else {
                    tricks += 3;
                }
                if (tricks >= 9) {
                    return true;
                }
            }
            return false;
        }
        prepareBid() {
            return BidCollection_11.BidCollection.makeBid(3, this.longestSuit, true);
        }
    }
    exports.PreemptiveBid = PreemptiveBid;
});
define("core/bidding/rules/Rebid", ["require", "exports", "core/bidding/rules/BiddingRule"], function (require, exports, BiddingRule_9) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid = void 0;
    class Rebid extends BiddingRule_9.BiddingRule {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (this.auction.biddingSequenceLength() === 2) {
                const getCall = this.auction.getPartnersLastCall();
                this.response = getCall.getBid();
                this.opening = this.auction.getPartnersCall(getCall).getBid();
                if (this.auction.isOpening(this.opening)) {
                    return true;
                }
            }
            return false;
        }
    }
    exports.Rebid = Rebid;
});
define("core/bidding/rules/RebidToLevel1Response", ["require", "exports", "core/bidding/rules/Rebid"], function (require, exports, Rebid_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidToLevel1Response = void 0;
    class RebidToLevel1Response extends Rebid_1.Rebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.value == 1;
        }
    }
    exports.RebidToLevel1Response = RebidToLevel1Response;
});
define("core/bidding/rules/Rebid1ColorOriginalSuit", ["require", "exports", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/RebidToLevel1Response"], function (require, exports, BidCollection_12, PointCalculator_9, RebidToLevel1Response_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid1ColorOriginalSuit = void 0;
    class Rebid1ColorOriginalSuit extends RebidToLevel1Response_1.RebidToLevel1Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.opening.trump.isSuit() && this.response.trump !== this.opening.trump;
        }
        prepareBid() {
            const points = new PointCalculator_9.PointCalculator(this.hand).getCombinedPoints();
            if (this.opening.trump.isMajorSuit()) {
                if (this.response.equals(BidCollection_12.BidCollection.THREE_NOTRUMP)) {
                    return BidCollection_12.BidCollection.makeBid(4, this.opening.trump, true);
                }
                if (points >= 19 && this.hand.getSuitLength(this.opening.trump) >= 7) {
                    return BidCollection_12.BidCollection.makeBid(4, this.opening.trump, true);
                }
            }
            if (this.hand.getSuitLength(this.opening.trump) >= 6) {
                if (points <= 15) {
                    return BidCollection_12.BidCollection.makeBid(2, this.opening.trump, true);
                }
                else if (points <= 18) {
                    return BidCollection_12.BidCollection.makeBid(3, this.opening.trump, true);
                }
            }
            return null;
        }
    }
    exports.Rebid1ColorOriginalSuit = Rebid1ColorOriginalSuit;
});
define("core/bidding/rules/RebidToLevel2Response", ["require", "exports", "core/bidding/rules/Rebid"], function (require, exports, Rebid_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidToLevel2Response = void 0;
    class RebidToLevel2Response extends Rebid_2.Rebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.opening.value == 1 && this.response.value == 2;
        }
    }
    exports.RebidToLevel2Response = RebidToLevel2Response;
});
define("core/bidding/rules/Rebid1ColorRaiseOpener", ["require", "exports", "core/bidding/ResponseCalculator", "core/bidding/rules/RebidToLevel2Response", "core/bidding/BidCollection"], function (require, exports, ResponseCalculator_2, RebidToLevel2Response_1, BidCollection_13) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid1ColorRaiseOpener = void 0;
    class Rebid1ColorRaiseOpener extends RebidToLevel2Response_1.RebidToLevel2Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump.isSuit() && this.response.trump === this.opening.trump;
        }
        prepareBid() {
            const trump = this.response.trump;
            if (trump.isMinorSuit()) {
                return BidCollection_13.BidCollection.makeBid(3, trump, true);
            }
            else {
                const calc = new ResponseCalculator_2.ResponseCalculator(this.hand, this.response);
                const points = calc.getCombinedPoints();
                if (points >= 19) {
                    return BidCollection_13.BidCollection.makeBid(4, trump, true);
                }
                else if (points >= 16) {
                    return BidCollection_13.BidCollection.makeBid(3, trump, true);
                }
            }
            return null;
        }
    }
    exports.Rebid1ColorRaiseOpener = Rebid1ColorRaiseOpener;
});
define("core/bidding/rules/Rebid1ColorRaisePartner", ["require", "exports", "core/bidding/BidCollection", "core/bidding/ResponseCalculator", "core/bidding/rules/RebidToLevel1Response"], function (require, exports, BidCollection_14, ResponseCalculator_3, RebidToLevel1Response_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid1ColorRaisePartner = void 0;
    class Rebid1ColorRaisePartner extends RebidToLevel1Response_2.RebidToLevel1Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump.isSuit() && this.getTrumpCount() >= 4;
        }
        prepareBid() {
            const calc = new ResponseCalculator_3.ResponseCalculator(this.hand, this.response);
            if (calc.getCombinedPoints() >= 19) {
                return BidCollection_14.BidCollection.makeBid(4, this.response.trump, true);
            }
            else if (calc.getCombinedPoints() >= 16) {
                return BidCollection_14.BidCollection.makeBid(3, this.response.trump, true);
            }
            else {
                return BidCollection_14.BidCollection.makeBid(2, this.response.trump, true);
            }
        }
        getTrumpCount() {
            return this.hand.getSuitLength(this.response.trump);
        }
    }
    exports.Rebid1ColorRaisePartner = Rebid1ColorRaisePartner;
});
define("core/bidding/rules/Rebid1ColorWithNewSuit", ["require", "exports", "core/deck/SuitCollection", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/RebidToLevel1Response"], function (require, exports, SuitCollection_8, BidCollection_15, PointCalculator_10, RebidToLevel1Response_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid1ColorWithNewSuit = void 0;
    class Rebid1ColorWithNewSuit extends RebidToLevel1Response_3.RebidToLevel1Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (super.applies()) {
                this.unbidSuit = this.getUnbidSuitWithAtLeast4Cards();
                if (this.unbidSuit != null) {
                    return true;
                }
            }
            return false;
        }
        prepareBid() {
            const calc = new PointCalculator_10.PointCalculator(this.hand);
            const minimumBid = this.getMinimumBidInSuit(this.unbidSuit);
            if (calc.getCombinedPoints() >= 19) {
                const bid = BidCollection_15.BidCollection.makeBid(minimumBid + 1, this.unbidSuit, true);
                bid.makeGameForcing();
                return bid;
            }
            if ((minimumBid == 2 && !calc.isBalanced())) {
                if (calc.getCombinedPoints() >= 16) {
                    return BidCollection_15.BidCollection.makeBid(minimumBid, this.unbidSuit, true);
                }
                this.unbidSuit = this.getLowerUnbidSuitWithAtLeast4Cards();
                if (this.unbidSuit != null) {
                    return BidCollection_15.BidCollection.makeBid(minimumBid, this.unbidSuit, true);
                }
            }
            if (minimumBid == 1) {
                return BidCollection_15.BidCollection.makeBid(minimumBid, this.unbidSuit, true);
            }
            return null;
        }
        getMinimumBidInSuit(suit) {
            if (this.auction.isValid(BidCollection_15.BidCollection.makeBid(1, suit, false))) {
                return 1;
            }
            else {
                return 2;
            }
        }
        getUnbidSuitWithAtLeast4Cards() {
            return SuitCollection_8.SuitCollection.list.find((color) => this.hand.getSuitLength(color) >= 4 && this.hasNotBeenBid(color));
        }
        getLowerUnbidSuitWithAtLeast4Cards() {
            return SuitCollection_8.SuitCollection.list.find((color) => this.hand.getSuitLength(color) >= 4 &&
                color.isLowerRankThan(this.opening.trump) && this.hasNotBeenBid(color));
        }
        hasNotBeenBid(suit) {
            return suit !== this.response.trump && suit !== this.opening.trump;
        }
    }
    exports.Rebid1ColorWithNewSuit = Rebid1ColorWithNewSuit;
});
define("core/bidding/rules/Rebid1ColorWithNT", ["require", "exports", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/RebidToLevel1Response"], function (require, exports, BidCollection_16, PointCalculator_11, RebidToLevel1Response_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid1ColorWithNT = void 0;
    class Rebid1ColorWithNT extends RebidToLevel1Response_4.RebidToLevel1Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            const pc = new PointCalculator_11.PointCalculator(this.hand);
            return super.applies() && pc.isBalanced();
        }
        prepareBid() {
            const pc = new PointCalculator_11.PointCalculator(this.hand);
            const HCP = pc.getHighCardPoints();
            if (HCP >= 12 && HCP <= 14) {
                return BidCollection_16.BidCollection.ONE_NOTRUMP_C();
            }
            else if (HCP >= 18 && HCP <= 19) {
                return BidCollection_16.BidCollection.TWO_NOTRUMP_C();
            }
            else {
                return null;
            }
        }
    }
    exports.Rebid1ColorWithNT = Rebid1ColorWithNT;
});
define("core/bidding/rules/Rebid1NT", ["require", "exports", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/Rebid", "core/deck/NoTrump", "core/deck/SuitValues"], function (require, exports, BidCollection_17, PointCalculator_12, Rebid_3, NoTrump_10, SuitValues_9) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid1NT = void 0;
    class Rebid1NT extends Rebid_3.Rebid {
        constructor(a, h) {
            super(a, h);
            this.fourthOvercalled = false;
        }
        prepareBid() {
            let result = null;
            const pc = new PointCalculator_12.PointCalculator(this.hand);
            const level = this.response.value;
            const trump = this.response.trump;
            const maximum = this.fourthOvercalled ? 14 : 17;
            if (level == 2) {
                if (trump === SuitValues_9.Clubs) {
                    if (this.hand.getSuitLength(SuitValues_9.Hearts) >= 4) {
                        result = BidCollection_17.BidCollection.TWO_HEARTS_C();
                    }
                    else if (this.hand.getSuitLength(SuitValues_9.Spades) >= 4) {
                        result = BidCollection_17.BidCollection.TWO_SPADES_C();
                    }
                    else {
                        result = BidCollection_17.BidCollection.TWO_DIAMONDS_C();
                    }
                }
                else if (trump === SuitValues_9.Spades) {
                    if (this.hand.getSuitLength(SuitValues_9.Clubs) >= 4) {
                        result = BidCollection_17.BidCollection.THREE_CLUBS_C();
                    }
                    else if (this.hand.getSuitLength(SuitValues_9.Diamonds) >= 4) {
                        result = BidCollection_17.BidCollection.THREE_DIAMONDS_C();
                    }
                    else {
                        result = BidCollection_17.BidCollection.TWO_NOTRUMP_C();
                    }
                }
                else if (trump.isNoTrump()) {
                    if (pc.getHighCardPoints() >= maximum) {
                        result = BidCollection_17.BidCollection.THREE_NOTRUMP_C();
                    }
                    else {
                        result = BidCollection_17.BidCollection.PASS;
                    }
                }
                else if (trump === SuitValues_9.Diamonds) {
                    if (pc.getCombinedPoints() >= maximum) {
                        result = BidCollection_17.BidCollection.TWO_SPADES_C();
                    }
                    else {
                        result = BidCollection_17.BidCollection.TWO_HEARTS_C();
                    }
                }
                else {
                    if (pc.getCombinedPoints() >= maximum) {
                        result = BidCollection_17.BidCollection.TWO_NOTRUMP_C();
                    }
                    else {
                        result = BidCollection_17.BidCollection.TWO_SPADES_C();
                    }
                }
            }
            else if (level == 3) {
                if (trump.isNoTrump()) {
                    result = BidCollection_17.BidCollection.PASS;
                }
                else if (this.hand.getSuitLength(trump) >= 2) {
                    if (trump.isMajorSuit()) {
                        result = BidCollection_17.BidCollection.makeBid(4, trump, true);
                    }
                    else if (pc.getHighCardPoints() >= maximum) {
                        result = BidCollection_17.BidCollection.THREE_NOTRUMP_C();
                    }
                }
            }
            return result;
        }
        partnerWasRespondingToMy1NT() {
            if (super.applies()) {
                return BidCollection_17.BidCollection.makeBid(1, NoTrump_10.NoTrump, true).equals(this.opening);
            }
            else {
                if (this.opening != null) {
                    if (this.auction.isOvercall(this.opening)) {
                        if (this.auction.isFourthOvercall(this.opening)) {
                            this.fourthOvercalled = true;
                        }
                        return BidCollection_17.BidCollection.makeBid(1, NoTrump_10.NoTrump, true).equals(this.opening);
                    }
                }
                return false;
            }
        }
        applies() {
            return this.partnerWasRespondingToMy1NT();
        }
    }
    exports.Rebid1NT = Rebid1NT;
});
define("core/bidding/rules/Rebid2C", ["require", "exports", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/Rebid"], function (require, exports, SuitCollection_9, SuitValues_10, BidCollection_18, PointCalculator_13, Rebid_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid2C = void 0;
    class Rebid2C extends Rebid_4.Rebid {
        constructor(a, h) {
            super(a, h);
        }
        prepareBid() {
            let result = null;
            const pc = new PointCalculator_13.PointCalculator(this.hand);
            const rank = this.response.value;
            const trump = this.response.trump;
            const HCP = pc.getHighCardPoints();
            if (rank == 2) {
                if (trump === SuitValues_10.Diamonds) {
                    result = this.getLowestBid(2);
                    if (result == null) {
                        if (HCP <= 24) {
                            if (pc.isBalanced()) {
                                result = BidCollection_18.BidCollection.TWO_NOTRUMP_C();
                            }
                        }
                        else if (HCP <= 27) {
                            result = BidCollection_18.BidCollection.THREE_NOTRUMP_C();
                        }
                        else if (HCP <= 30) {
                            result = BidCollection_18.BidCollection.FOUR_NOTRUMP_C();
                        }
                    }
                }
                else {
                    if (HCP >= 3) {
                        if (this.hand.getSuitLength(trump) >= 3) {
                            result = BidCollection_18.BidCollection.makeBid(3, trump, true);
                        }
                        else {
                            result = this.getLowestBid(2);
                        }
                    }
                    if (result == null) {
                        result = BidCollection_18.BidCollection.TWO_NOTRUMP_C();
                    }
                }
            }
            else if (rank == 3) {
                if (HCP >= 3) {
                    if (this.hand.getSuitLength(trump) >= 3) {
                        result = BidCollection_18.BidCollection.makeBid(3, trump, true);
                    }
                    else {
                        result = this.getLowestBid(3);
                    }
                }
                if (result == null) {
                    if (trump === SuitValues_10.Clubs) {
                        result = BidCollection_18.BidCollection.THREE_DIAMONDS_C();
                    }
                    else if (trump === SuitValues_10.Diamonds) {
                        result = BidCollection_18.BidCollection.THREE_HEARTS_C();
                    }
                }
            }
            return result;
        }
        applies() {
            return super.applies() && BidCollection_18.BidCollection.TWO_CLUBS.equals(this.opening);
        }
        getLowestBid(level) {
            const lowestColor = SuitCollection_9.SuitCollection.mmList.find(color => this.hand.getSuitLength(color) >= 5);
            return lowestColor ? BidCollection_18.BidCollection.makeBid(this.getLowestLevel(level, lowestColor), lowestColor, true) : null;
        }
        getLowestLevel(base, suit) {
            if (this.auction.isValid(BidCollection_18.BidCollection.makeBid(base, suit, false))) {
                return base;
            }
            else {
                return base + 1;
            }
        }
    }
    exports.Rebid2C = Rebid2C;
});
define("core/bidding/rules/Rebid2NT", ["require", "exports", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/rules/Rebid"], function (require, exports, SuitValues_11, BidCollection_19, Rebid_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rebid2NT = void 0;
    class Rebid2NT extends Rebid_5.Rebid {
        constructor(a, h) {
            super(a, h);
        }
        prepareBid() {
            let result = null;
            const level = this.response.value;
            const trump = this.response.trump;
            if (level == 3) {
                if (trump.isNoTrump()) {
                    result = BidCollection_19.BidCollection.PASS;
                }
                if (trump === SuitValues_11.Clubs) {
                    if (this.hand.getSuitLength(SuitValues_11.Hearts) >= 4) {
                        result = BidCollection_19.BidCollection.makeBid(3, SuitValues_11.Hearts, true);
                    }
                    else if (this.hand.getSuitLength(SuitValues_11.Spades) >= 4) {
                        result = BidCollection_19.BidCollection.makeBid(3, SuitValues_11.Spades, true);
                    }
                    else {
                        result = BidCollection_19.BidCollection.makeBid(3, SuitValues_11.Diamonds, true);
                    }
                }
                else {
                    if (trump === SuitValues_11.Diamonds) {
                        result = BidCollection_19.BidCollection.makeBid(3, SuitValues_11.Hearts, true);
                    }
                    else if (trump === SuitValues_11.Hearts) {
                        result = BidCollection_19.BidCollection.makeBid(3, SuitValues_11.Spades, true);
                    }
                }
            }
            return result;
        }
        partnerWasRespondingToMy2NT() {
            return super.applies() && BidCollection_19.BidCollection.TWO_NOTRUMP.equals(this.opening);
        }
        applies() {
            return this.partnerWasRespondingToMy2NT();
        }
    }
    exports.Rebid2NT = Rebid2NT;
});
define("core/bidding/rules/RebidAfter1NT", ["require", "exports", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/RebidToLevel1Response"], function (require, exports, BidCollection_20, PointCalculator_14, RebidToLevel1Response_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidAfter1NT = void 0;
    class RebidAfter1NT extends RebidToLevel1Response_5.RebidToLevel1Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump.isNoTrump();
        }
        prepareBid() {
            const pc = new PointCalculator_14.PointCalculator(this.hand);
            const HCP = pc.getHighCardPoints();
            if (HCP >= 19 && (pc.isTame() || pc.isBalanced())) {
                return BidCollection_20.BidCollection.THREE_NOTRUMP_C();
            }
            else if (HCP >= 16 && pc.isTame()) {
                return BidCollection_20.BidCollection.TWO_NOTRUMP_C();
            }
            else {
                return null;
            }
        }
    }
    exports.RebidAfter1NT = RebidAfter1NT;
});
define("core/bidding/rules/RebidAfterForcing1NT", ["require", "exports", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/RebidToLevel1Response"], function (require, exports, SuitCollection_10, SuitValues_12, BidCollection_21, PointCalculator_15, RebidToLevel1Response_6) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidAfterForcing1NT = void 0;
    class RebidAfterForcing1NT extends RebidToLevel1Response_6.RebidToLevel1Response {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump.isNoTrump() && this.opening.trump.isMajorSuit();
        }
        prepareBid() {
            const pc = new PointCalculator_15.PointCalculator(this.hand);
            const HCP = pc.getHighCardPoints();
            const open = this.opening.trump;
            if (HCP >= 19) {
                let result = null;
                SuitCollection_10.SuitCollection.mmList.forEach((color) => {
                    {
                        if (color.isLowerRankThan(open) && this.hand.getSuitLength(color) >= 4) {
                            result = BidCollection_21.BidCollection.makeBid(3, color, true);
                            if (this.auction.isValid(result)) {
                                return result;
                            }
                            result = null;
                        }
                    }
                });
            }
            else {
                if (this.hand.getSuitLength(open) >= 6) {
                    if (this.hand.getSuitLength(open) == 6 && HCP <= 15) {
                        return BidCollection_21.BidCollection.makeBid(2, open, true);
                    }
                    else if (HCP >= 15 && HCP <= 18) {
                        return BidCollection_21.BidCollection.makeBid(3, open, true);
                    }
                }
            }
            if (HCP >= 18 && pc.isBalanced()) {
                return BidCollection_21.BidCollection.cloneBid(BidCollection_21.BidCollection.TWO_NOTRUMP);
            }
            if (open === SuitValues_12.Hearts) {
                if (HCP >= 17 && this.hand.getSuitLength(open) >= 5 && this.hand.getSuitLength(SuitValues_12.Spades) >= 4) {
                    return BidCollection_21.BidCollection.TWO_SPADES_C();
                }
            }
            else if (this.hand.getSuitLength(SuitValues_12.Hearts) >= 4) {
                return BidCollection_21.BidCollection.TWO_HEARTS_C();
            }
            let longer = SuitValues_12.Clubs;
            if (this.hand.AisStronger(SuitValues_12.Diamonds, longer)) {
                longer = SuitValues_12.Diamonds;
            }
            if (this.hand.getSuitLength(longer) >= 3) {
                return BidCollection_21.BidCollection.makeBid(2, longer, true);
            }
            return BidCollection_21.BidCollection.PASS;
        }
    }
    exports.RebidAfterForcing1NT = RebidAfterForcing1NT;
});
define("core/bidding/rules/RebidForcing1NT", ["require", "exports", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/PartnersRebid"], function (require, exports, SuitCollection_11, SuitValues_13, BidCollection_22, PointCalculator_16, PartnersRebid_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidForcing1NT = void 0;
    class RebidForcing1NT extends PartnersRebid_4.PartnersRebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump.isNoTrump() && this.response.value == 1 && this.opening.trump.isMajorSuit() && this.rebid.hasTrump();
        }
        prepareBid() {
            const pc = new PointCalculator_16.PointCalculator(this.hand);
            const level = this.rebid.value;
            const HCP = pc.getHighCardPoints();
            const open = this.opening.trump;
            const trump = this.rebid.trump;
            const lengthOfTrump = this.hand.getSuitLength(open);
            if (level == 2) {
                if (trump.isNoTrump()) {
                    if (this.hand.getSuitLength(open) >= 3) {
                        if (HCP >= 8) {
                            return BidCollection_22.BidCollection.makeBid(3, open, true);
                        }
                        else {
                            return BidCollection_22.BidCollection.makeBid(4, open, true);
                        }
                    }
                    if (HCP >= 9) {
                        const unbidSuit = this.getLongestUnbidSuit();
                        if (unbidSuit != null) {
                            return BidCollection_22.BidCollection.makeBid(3, unbidSuit, true);
                        }
                        else if (pc.isBalanced()) {
                            return BidCollection_22.BidCollection.cloneBid(BidCollection_22.BidCollection.THREE_NOTRUMP);
                        }
                    }
                }
                else if (trump.isMinorSuit()) {
                    if (lengthOfTrump >= 2) {
                        if (lengthOfTrump == 2 || HCP <= 7) {
                            return BidCollection_22.BidCollection.makeBid(2, open, true);
                        }
                        else {
                            return BidCollection_22.BidCollection.makeBid(3, open, true);
                        }
                    }
                    if (this.hand.getSuitLength(trump) >= 5) {
                        if (HCP >= 8) {
                            return BidCollection_22.BidCollection.makeBid(3, trump, true);
                        }
                    }
                    if (HCP >= 10 && HCP <= 12) {
                        return BidCollection_22.BidCollection.cloneBid(BidCollection_22.BidCollection.TWO_NOTRUMP);
                    }
                    if (HCP <= 10) {
                        const color = this.getUnbidSuitWithAtLeast5Cards();
                        if (color != null) {
                            return BidCollection_22.BidCollection.makeBid(2, color, true);
                        }
                    }
                }
                else {
                    if (trump === open) {
                        if (HCP >= 10) {
                            return BidCollection_22.BidCollection.makeBid(3, open, true);
                        }
                    }
                    else {
                        if (trump === SuitValues_13.Hearts) {
                            if (HCP >= 11 && this.hand.getSuitLength(SuitValues_13.Hearts) >= 5) {
                                return BidCollection_22.BidCollection.FOUR_HEARTS_C();
                            }
                            else if (HCP >= 8 && this.hand.getSuitLength(SuitValues_13.Hearts) >= 4) {
                                return BidCollection_22.BidCollection.THREE_HEARTS_C();
                            }
                        }
                        else {
                            if (HCP >= 8) {
                                if (this.hand.getSuitLength(SuitValues_13.Hearts) >= 3) {
                                    return BidCollection_22.BidCollection.FOUR_HEARTS_C();
                                }
                                else if (this.hand.getSuitLength(SuitValues_13.Spades) >= 4) {
                                    return BidCollection_22.BidCollection.FOUR_SPADES_C();
                                }
                            }
                            else {
                                if (this.hand.getSuitLength(SuitValues_13.Hearts) >= 3) {
                                    return BidCollection_22.BidCollection.THREE_HEARTS_C();
                                }
                                else if (this.hand.getSuitLength(SuitValues_13.Spades) >= 4) {
                                    return BidCollection_22.BidCollection.THREE_SPADES_C();
                                }
                            }
                            if (pc.isBalanced()) {
                                if (HCP <= 9) {
                                    return BidCollection_22.BidCollection.TWO_NOTRUMP_C();
                                }
                                else if (this.hand.haveStrongStopper(SuitValues_13.Clubs) && this.hand.haveStrongStopper(SuitValues_13.Diamonds)) {
                                    return BidCollection_22.BidCollection.THREE_NOTRUMP_C();
                                }
                            }
                        }
                    }
                }
            }
            return null;
        }
        getUnbidSuitWithAtLeast5Cards() {
            return SuitCollection_11.SuitCollection.reverseList.find((color) => (this.hand.getSuitLength(color) >= 5 && this.hasNotBeenBid(color)));
        }
        getLongestUnbidSuit() {
            let longer = null;
            SuitCollection_11.SuitCollection.mmList.forEach((color) => {
                if (this.hand.getSuitLength(color) >= 5 && this.hand.AisStronger(color, longer) && color !== this.opening.trump) {
                    longer = color;
                }
            });
            return longer;
        }
        hasNotBeenBid(suit) {
            return suit !== this.rebid.trump && suit !== this.opening.trump;
        }
    }
    exports.RebidForcing1NT = RebidForcing1NT;
});
define("core/bidding/rules/PRebidNoTrump", ["require", "exports", "core/bidding/rules/PartnersRebid"], function (require, exports, PartnersRebid_5) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PRebidNoTrump = void 0;
    class PRebidNoTrump extends PartnersRebid_5.PartnersRebid {
        constructor(a, h) {
            super(a, h);
            this.fourthOvercalled = false;
        }
        applies() {
            if (super.applies()) {
                this.level = this.opening.value;
                if (this.opening.trump.isNoTrump() && this.level < 3) {
                    if (this.auction.isFourthOvercall(this.opening)) {
                        this.fourthOvercalled = true;
                    }
                    return true;
                }
            }
            return false;
        }
    }
    exports.PRebidNoTrump = PRebidNoTrump;
});
define("core/bidding/rules/RebidJacobyTransfer", ["require", "exports", "core/bidding/rules/PRebidNoTrump", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/deck/NoTrump", "core/deck/SuitValues"], function (require, exports, PRebidNoTrump_1, BidCollection_23, PointCalculator_17, NoTrump_11, SuitValues_14) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidJacobyTransfer = void 0;
    class RebidJacobyTransfer extends PRebidNoTrump_1.PRebidNoTrump {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.value == this.level + 1 && (this.response.trump === SuitValues_14.Diamonds || this.response.trump === SuitValues_14.Hearts);
        }
        prepareBid() {
            const pc = new PointCalculator_17.PointCalculator(this.hand);
            const transfer = this.response.trump;
            const trump = this.rebid.trump;
            const HCP = this.fourthOvercalled ? pc.getHighCardPoints() - 3 : pc.getHighCardPoints();
            const INVITATION = (this.level == 1) ? 10 : 5;
            if (transfer === SuitValues_14.Diamonds) {
                if (trump === SuitValues_14.Spades) {
                    if (HCP >= 8) {
                        return BidCollection_23.BidCollection.FOUR_HEARTS_C();
                    }
                    else {
                        return BidCollection_23.BidCollection.cloneBid(BidCollection_23.BidCollection.THREE_NOTRUMP);
                    }
                }
                else {
                    if (HCP >= INVITATION) {
                        if (this.hand.getSuitLength(SuitValues_14.Hearts) >= 3) {
                            return BidCollection_23.BidCollection.FOUR_HEARTS_C();
                        }
                        else {
                            return BidCollection_23.BidCollection.cloneBid(BidCollection_23.BidCollection.THREE_NOTRUMP);
                        }
                    }
                }
            }
            else {
                if (trump === NoTrump_11.NoTrump) {
                    if (HCP >= 8) {
                        return BidCollection_23.BidCollection.FOUR_SPADES_C();
                    }
                    else {
                        return BidCollection_23.BidCollection.cloneBid(BidCollection_23.BidCollection.THREE_NOTRUMP);
                    }
                }
                else {
                    if (HCP >= INVITATION) {
                        if (this.hand.getSuitLength(SuitValues_14.Hearts) >= 3) {
                            return BidCollection_23.BidCollection.FOUR_SPADES_C();
                        }
                        else {
                            return BidCollection_23.BidCollection.cloneBid(BidCollection_23.BidCollection.THREE_NOTRUMP);
                        }
                    }
                }
            }
            return null;
        }
    }
    exports.RebidJacobyTransfer = RebidJacobyTransfer;
});
define("core/bidding/rules/RebidMinorSuitStayman", ["require", "exports", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/PRebidNoTrump"], function (require, exports, SuitValues_15, BidCollection_24, PointCalculator_18, PRebidNoTrump_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidMinorSuitStayman = void 0;
    class RebidMinorSuitStayman extends PRebidNoTrump_2.PRebidNoTrump {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump === SuitValues_15.Spades && this.response.value == 2;
        }
        prepareBid() {
            const pc = new PointCalculator_18.PointCalculator(this.hand);
            let result = null;
            const points = this.fourthOvercalled ? pc.getCombinedPoints() - 3 : pc.getCombinedPoints();
            const clubs = this.hand.getSuitLength(SuitValues_15.Clubs);
            const diamonds = this.hand.getSuitLength(SuitValues_15.Diamonds);
            if (points <= 7 && diamonds >= 5) {
                if (diamonds >= 6) {
                    result = BidCollection_24.BidCollection.THREE_DIAMONDS_C();
                }
                else if (clubs >= 5) {
                    result = BidCollection_24.BidCollection.THREE_CLUBS_C();
                }
                if (this.auction.isValid(result)) {
                    return result;
                }
            }
            return result;
        }
    }
    exports.RebidMinorSuitStayman = RebidMinorSuitStayman;
});
define("core/bidding/rules/RebidStayman", ["require", "exports", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/PRebidNoTrump"], function (require, exports, SuitValues_16, BidCollection_25, PointCalculator_19, PRebidNoTrump_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidStayman = void 0;
    class RebidStayman extends PRebidNoTrump_3.PRebidNoTrump {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.response.trump === SuitValues_16.Clubs && this.response.value == this.level + 1 && this.rebid.trump.isSuit();
        }
        prepareBid() {
            const pc = new PointCalculator_19.PointCalculator(this.hand);
            const trump = this.rebid.trump;
            const hearts = this.hand.getSuitLength(SuitValues_16.Hearts);
            const spades = this.hand.getSuitLength(SuitValues_16.Spades);
            const points = this.fourthOvercalled ? pc.getCombinedPoints() - 3 : pc.getCombinedPoints();
            if (trump === SuitValues_16.Diamonds) {
                if (hearts == 5 && spades == 4) {
                    return BidCollection_25.BidCollection.makeBid(this.level + 1, SuitValues_16.Hearts, true);
                }
                else if (spades == 5 && hearts == 4) {
                    return BidCollection_25.BidCollection.makeBid(this.level + 1, SuitValues_16.Spades, true);
                }
                if (this.level == 1) {
                    if (points >= 10) {
                        if (hearts >= 5 && spades >= 5) {
                            return BidCollection_25.BidCollection.THREE_SPADES_C();
                        }
                        else if (this.hand.getSuitLength(SuitValues_16.Clubs) >= 5) {
                            return BidCollection_25.BidCollection.THREE_CLUBS_C();
                        }
                        else if (this.hand.getSuitLength(SuitValues_16.Diamonds) >= 5) {
                            return BidCollection_25.BidCollection.THREE_DIAMONDS_C();
                        }
                        else if (pc.isSemiBalanced()) {
                            return BidCollection_25.BidCollection.cloneBid(BidCollection_25.BidCollection.THREE_NOTRUMP);
                        }
                    }
                    else {
                        if (hearts >= 5 && spades >= 5) {
                            return BidCollection_25.BidCollection.THREE_HEARTS_C();
                        }
                        else {
                            return BidCollection_25.BidCollection.cloneBid(BidCollection_25.BidCollection.TWO_NOTRUMP);
                        }
                    }
                }
            }
            else if (trump.isMajorSuit()) {
                if (trump === SuitValues_16.Hearts) {
                    if (hearts == 4 && spades == 5) {
                        return BidCollection_25.BidCollection.makeBid(this.level + 1, SuitValues_16.Spades, true);
                    }
                }
                if (this.level == 1) {
                    if (this.hand.getSuitLength(trump) >= 4) {
                        if (points >= 8 && points <= 9) {
                            return BidCollection_25.BidCollection.makeBid(3, trump, true);
                        }
                        else if (points >= 10 && points <= 14) {
                            return BidCollection_25.BidCollection.makeBid(4, trump, true);
                        }
                    }
                    if (points >= 12) {
                        if (this.hand.getSuitLength(SuitValues_16.Clubs) >= 5) {
                            return BidCollection_25.BidCollection.THREE_CLUBS_C();
                        }
                        else if (this.hand.getSuitLength(SuitValues_16.Diamonds) >= 5) {
                            return BidCollection_25.BidCollection.THREE_DIAMONDS_C();
                        }
                    }
                }
                else if (this.level == 2) {
                    if (this.hand.getSuitLength(trump) >= 4) {
                        return BidCollection_25.BidCollection.makeBid(4, trump, true);
                    }
                }
            }
            return null;
        }
    }
    exports.RebidStayman = RebidStayman;
});
define("core/bidding/rules/RebidTakeoutDouble", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitCollection", "core/bidding/BidCollection", "core/bidding/ResponseCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, NoTrump_12, SuitCollection_12, BidCollection_26, ResponseCalculator_4, BiddingRule_10) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidTakeoutDouble = void 0;
    class RebidTakeoutDouble extends BiddingRule_10.BiddingRule {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            const responderCall = this.auction.getPartnersLastCall();
            if (responderCall != null && responderCall.getBid().hasTrump()) {
                const myOpeningBid = this.auction.getPartnersCall(responderCall);
                if (myOpeningBid != null) {
                    this.opening = myOpeningBid.getBid();
                    if (this.opening.isDouble() && this.auction.isOvercall(this.opening)) {
                        this.response = responderCall.getBid();
                        return true;
                    }
                }
            }
            return false;
        }
        prepareBid() {
            const doubledBid = this.auction.enemyCallBeforePartner(this.response).getBid();
            const calc = new ResponseCalculator_4.ResponseCalculator(this.hand, this.response);
            const level = this.response.value;
            const trump = this.response.trump;
            const dblTrump = doubledBid.trump;
            const points = calc.getCombinedPoints();
            if (trump.isNoTrump()) {
                if (level == 1) {
                    if (points >= 15) {
                        if (points >= 16) {
                            const suit = this.hand.getGood5LengthSuits().find((suit) => (suit !== dblTrump && this.auction.isValid(BidCollection_26.BidCollection.makeBid(2, suit, false))));
                            if (suit)
                                return BidCollection_26.BidCollection.makeBid(2, suit, true);
                        }
                        if (calc.isSemiBalanced() && this.haveStopperInEnemySuit()) {
                            return BidCollection_26.BidCollection.TWO_NOTRUMP_C();
                        }
                    }
                }
                else if (level == 2) {
                    if (points >= 14) {
                        const suit = this.hand.getGood5LengthSuits().find((suit) => (suit !== dblTrump && this.auction.isValid(BidCollection_26.BidCollection.makeBid(3, suit, false))));
                        if (suit)
                            return BidCollection_26.BidCollection.makeBid(3, suit, true);
                        if (calc.isSemiBalanced() && this.haveStopperInEnemySuit()) {
                            return BidCollection_26.BidCollection.cloneBid(BidCollection_26.BidCollection.THREE_NOTRUMP);
                        }
                    }
                }
            }
            else if (BidCollection_26.BidCollection.makeBid(doubledBid.value + 1, dblTrump, false).greaterThan(this.response)) {
                if (points >= 16) {
                    let result = null;
                    SuitCollection_12.SuitCollection.mmList.forEach((suit) => {
                        if (suit !== dblTrump && this.hand.isDecent5LengthSuits(suit)) {
                            const aresult = this.makeCheapestBid(suit);
                            if (this.auction.isValid(aresult)) {
                                result = aresult;
                            }
                        }
                    });
                    if (result)
                        return result;
                }
                if (points >= 19 && calc.isSemiBalanced() && this.haveStopperInEnemySuit()) {
                    return this.makeCheapestBid(NoTrump_12.NoTrump);
                }
            }
            else {
                if (points >= 16) {
                    if (this.hand.getSuitLength(trump) >= 3) {
                        if (trump.isMajorSuit()) {
                            return BidCollection_26.BidCollection.makeBid(4, trump, true);
                        }
                        else if (calc.getHighCardPoints(this.hand.getSuitHi2Low(trump)) >= 6) {
                            return BidCollection_26.BidCollection.makeBid(5, trump, true);
                        }
                    }
                    if (points >= 18 && calc.isBalanced() && this.haveStopperInEnemySuit()) {
                        return this.makeCheapestBid(NoTrump_12.NoTrump);
                    }
                    let result = null;
                    this.hand.getGood5LengthSuits().forEach((suit) => {
                        if (!result && suit !== dblTrump && this.auction.isValid(BidCollection_26.BidCollection.makeBid(3, suit, false))) {
                            result = BidCollection_26.BidCollection.makeBid(3, suit, true);
                        }
                    });
                    return result;
                }
            }
            return null;
        }
        makeCheapestBid(trump) {
            if (trump == null) {
                return null;
            }
            const candidate = BidCollection_26.BidCollection.makeBid(this.response.value, trump, true);
            if (this.auction.isValid(candidate)) {
                return candidate;
            }
            else {
                return BidCollection_26.BidCollection.makeBid(this.response.value + 1, trump, true);
            }
        }
    }
    exports.RebidTakeoutDouble = RebidTakeoutDouble;
});
define("core/bidding/rules/RebidWeakTwo", ["require", "exports", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/Rebid"], function (require, exports, SuitCollection_13, SuitValues_17, BidCollection_27, PointCalculator_20, Rebid_6) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RebidWeakTwo = void 0;
    class RebidWeakTwo extends Rebid_6.Rebid {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.opening.value == 2 && this.opening.trump !== SuitValues_17.Clubs && this.response.value == 2 && this.response.trump.isNoTrump();
        }
        prepareBid() {
            const pc = new PointCalculator_20.PointCalculator(this.hand);
            const HCP = pc.getHighCardPoints();
            if (this.opening.trump === SuitValues_17.Diamonds) {
                if (HCP >= 9) {
                    if (pc.isSemiBalanced() && this.hand.isGood5LengthSuits(SuitValues_17.Diamonds)) {
                        return BidCollection_27.BidCollection.THREE_NOTRUMP_C();
                    }
                    SuitCollection_13.SuitCollection.reverseList.forEach((color) => {
                        {
                            if (this.hand.getSuitLength(color) <= 1) {
                                return BidCollection_27.BidCollection.makeBid(3, color, true);
                            }
                        }
                    });
                }
                return BidCollection_27.BidCollection.THREE_DIAMONDS_C();
            }
            else {
                const color = this.opening.trump;
                if (HCP >= 9) {
                    if (pc.getHighCardPoints(this.hand.getSuitHi2Low(color)) >= 8) {
                        return BidCollection_27.BidCollection.THREE_NOTRUMP_C();
                    }
                    if (this.hand.isGood5LengthSuits(color)) {
                        return BidCollection_27.BidCollection.THREE_SPADES_C();
                    }
                    else {
                        return BidCollection_27.BidCollection.THREE_HEARTS_C();
                    }
                }
                else {
                    if (this.hand.isGood5LengthSuits(color)) {
                        return BidCollection_27.BidCollection.THREE_DIAMONDS_C();
                    }
                    else {
                        return BidCollection_27.BidCollection.THREE_CLUBS_C();
                    }
                }
            }
        }
    }
    exports.RebidWeakTwo = RebidWeakTwo;
});
define("core/bidding/rules/BidResponse", ["require", "exports", "core/bidding/rules/BiddingRule"], function (require, exports, BiddingRule_11) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BidResponse = void 0;
    class BidResponse extends BiddingRule_11.BiddingRule {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            const partnersCall = this.auction.getPartnersLastCall();
            if (partnersCall != null && partnersCall.getBid().hasTrump()) {
                this.partnersOpeningBid = partnersCall.getBid();
                const myOpeningCall = this.auction.getPartnersCall(partnersCall);
                if (myOpeningCall == null || myOpeningCall.isPass()) {
                    return true;
                }
            }
            return false;
        }
    }
    exports.BidResponse = BidResponse;
});
define("core/bidding/rules/Respond1ColorRaiseMajorSuit", ["require", "exports", "core/bidding/ResponseCalculator", "core/bidding/rules/BidResponse", "core/bidding/BidCollection"], function (require, exports, ResponseCalculator_5, BidResponse_1, BidCollection_28) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond1ColorRaiseMajorSuit = void 0;
    class Respond1ColorRaiseMajorSuit extends BidResponse_1.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            let result = false;
            if (super.applies()) {
                this.calc = new ResponseCalculator_5.ResponseCalculator(this.hand, this.partnersOpeningBid);
                if (this.partnersOpeningBid.hasTrump() && this.partnersOpeningBid.trump.isMajorSuit() && this.partnersOpeningBid.value == 1 &&
                    this.calc.getCombinedPoints() >= 8 && this.hand.getSuitLength(this.partnersOpeningBid.trump) >= 3) {
                    result = true;
                }
            }
            return result;
        }
        prepareBid() {
            const points = this.calc.getCombinedPoints();
            const trump = this.partnersOpeningBid.trump;
            if (points >= 10 && points <= 12 && this.hand.getSuitLength(trump) >= 4) {
                return BidCollection_28.BidCollection.makeBid(3, trump, true);
            }
            else if (points >= 8 && points <= 10) {
                return BidCollection_28.BidCollection.makeBid(2, trump, true);
            }
            else {
                return null;
            }
        }
    }
    exports.Respond1ColorRaiseMajorSuit = Respond1ColorRaiseMajorSuit;
});
define("core/bidding/rules/Respond1ColorRaiseMinorSuit", ["require", "exports", "core/bidding/ResponseCalculator", "core/bidding/rules/BidResponse", "core/bidding/BidCollection"], function (require, exports, ResponseCalculator_6, BidResponse_2, BidCollection_29) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond1ColorRaiseMinorSuit = void 0;
    class Respond1ColorRaiseMinorSuit extends BidResponse_2.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            let result = false;
            if (super.applies()) {
                this.calc = new ResponseCalculator_6.ResponseCalculator(this.hand, this.partnersOpeningBid);
                if (this.partnersOpeningBid.trump.isMinorSuit() && this.partnersOpeningBid.value == 1 &&
                    this.hand.getSuitLength(this.partnersOpeningBid.trump) >= 4) {
                    result = true;
                }
            }
            return result;
        }
        prepareBid() {
            const points = this.calc.getCombinedPoints();
            const trump = this.partnersOpeningBid.trump;
            if (points >= 10 && (this.hand.getSuitLength(trump) != 4 || this.calc.getHighCardPoints(this.hand.getSuitHi2Low(trump)) > 4)) {
                return BidCollection_29.BidCollection.makeBid(2, trump, true);
            }
            const vulnerabilityIndex = this.auction.getVulnerabilityIndex();
            if (this.hand.getSuitLength(trump) >= 5 && ((vulnerabilityIndex >= 2 && points >= 5 && points <= 9) || (vulnerabilityIndex == 1 && points <= 8) || (vulnerabilityIndex == 0 && points >= 5 && points <= 8))) {
                return BidCollection_29.BidCollection.makeBid(3, trump, true);
            }
            return null;
        }
    }
    exports.Respond1ColorRaiseMinorSuit = Respond1ColorRaiseMinorSuit;
});
define("core/bidding/rules/Respond1ColorWithNewSuit", ["require", "exports", "core/deck/NoTrump", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/ResponseCalculator", "core/bidding/rules/BidResponse"], function (require, exports, NoTrump_13, SuitCollection_14, SuitValues_18, BidCollection_30, ResponseCalculator_7, BidResponse_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond1ColorWithNewSuit = void 0;
    class Respond1ColorWithNewSuit extends BidResponse_3.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            let result = false;
            if (super.applies() && this.partnerBid1Color()) {
                this.pc = new ResponseCalculator_7.ResponseCalculator(this.hand, this.partnersOpeningBid);
                this.unbidSuit = this.findHighestColorWithFourOrMoreCards();
                if (this.pc.getCombinedPoints() >= 6 && this.unbidSuit != null) {
                    result = true;
                }
            }
            return result;
        }
        prepareBid() {
            const points = this.pc.getCombinedPoints();
            const length = this.hand.getSuitLength(this.unbidSuit);
            if (this.unbidSuit === SuitValues_18.Diamonds && points >= 12 && this.partnersOpeningBid.trump === SuitValues_18.Clubs) {
                if (this.hand.getSuitLength(SuitValues_18.Diamonds) >= 5 && (length == 6 || this.hand.getSuitLength(SuitValues_18.Clubs) >= 4)) {
                    return BidCollection_30.BidCollection.makeBid(2, this.unbidSuit, true);
                }
            }
            if (length == 6) {
                if (points <= 7 && this.unbidSuit !== SuitValues_18.Diamonds) {
                    return BidCollection_30.BidCollection.makeBid(2, this.unbidSuit, true);
                }
            }
            const result = BidCollection_30.BidCollection.makeBid(1, this.unbidSuit, true);
            if (!this.auction.isValid(result) && points >= 12) {
                this.unbidSuit = this.findTwoOverOneSuit();
                if (this.unbidSuit != null) {
                    return BidCollection_30.BidCollection.makeBid(2, this.unbidSuit, true);
                }
            }
            else {
                return result;
            }
            this.unbidSuit = this.getLowerUnbidSuitWithAtLeast6Cards();
            if (this.unbidSuit != null && points >= 9 && points <= 11) {
                return BidCollection_30.BidCollection.makeBid(3, this.unbidSuit, true);
            }
            return null;
        }
        partnerBid1Color() {
            if (NoTrump_13.NoTrump !== this.partnersOpeningBid.trump && 1 == this.partnersOpeningBid.value) {
                return true;
            }
            else {
                return false;
            }
        }
        findHighestColorWithFourOrMoreCards() {
            let longer = null;
            SuitCollection_14.SuitCollection.list.forEach((color) => {
                if (this.hand.getSuitLength(color) >= 4 && this.hand.AisStronger(color, longer) && color !== this.partnersOpeningBid.trump) {
                    longer = color;
                }
            });
            return longer;
        }
        findTwoOverOneSuit() {
            let longer = null;
            SuitCollection_14.SuitCollection.mmList.forEach((color) => {
                if (color.isLowerRankThan(this.partnersOpeningBid.trump) && this.hand.AisStronger(color, longer)) {
                    longer = color;
                }
            });
            if (longer == null) {
                return null;
            }
            const length = this.hand.getSuitLength(longer);
            if (length < 4 || (length == 4 && this.partnersOpeningBid.trump !== SuitValues_18.Diamonds)) {
                longer = null;
            }
            return longer;
        }
        getLowerUnbidSuitWithAtLeast6Cards() {
            return SuitCollection_14.SuitCollection.mmList.find((color) => this.hand.getSuitLength(color) >= 6 && color.isLowerRankThan(this.partnersOpeningBid.trump));
        }
    }
    exports.Respond1ColorWithNewSuit = Respond1ColorWithNewSuit;
});
define("core/bidding/rules/Respond1ColorWithNT", ["require", "exports", "core/bidding/BidCollection", "core/bidding/ResponseCalculator", "core/bidding/rules/BidResponse"], function (require, exports, BidCollection_31, ResponseCalculator_8, BidResponse_4) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond1ColorWithNT = void 0;
    class Respond1ColorWithNT extends BidResponse_4.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            let result = false;
            if (super.applies()) {
                this.calc = new ResponseCalculator_8.ResponseCalculator(this.hand, this.partnersOpeningBid);
                if (this.partnersOpeningBid.trump.isSuit() && this.partnersOpeningBid.value == 1 && this.calc.getCombinedPoints() >= 6) {
                    result = true;
                }
            }
            return result;
        }
        prepareBid() {
            let result = null;
            const trump = this.partnersOpeningBid.trump;
            const HCP = this.calc.getHighCardPoints();
            if (trump.isMajorSuit()) {
                if (HCP >= 12 && this.calc.isBalanced()) {
                    if (HCP <= 15 && this.hand.getSuitLength(trump) >= 4) {
                        result = BidCollection_31.BidCollection.THREE_NOTRUMP_C();
                    }
                    else if (HCP >= 13) {
                        result = BidCollection_31.BidCollection.TWO_NOTRUMP_C();
                    }
                }
                else if (HCP <= 12) {
                    result = BidCollection_31.BidCollection.ONE_NOTRUMP_C();
                    result.makeForcing();
                }
            }
            else {
                if (HCP >= 6 && HCP <= 10) {
                    result = BidCollection_31.BidCollection.ONE_NOTRUMP_C();
                }
                else if (HCP >= 11 && HCP <= 12 && this.calc.isBalanced()) {
                    result = BidCollection_31.BidCollection.TWO_NOTRUMP_C();
                }
                else if (HCP >= 13 && HCP <= 15 && this.calc.isBalanced()) {
                    result = BidCollection_31.BidCollection.THREE_NOTRUMP_C();
                }
            }
            return result;
        }
    }
    exports.Respond1ColorWithNT = Respond1ColorWithNT;
});
define("core/bidding/rules/Respond1NT", ["require", "exports", "core/bidding/PointCalculator", "core/bidding/rules/BidResponse", "core/bidding/BidCollection", "core/deck/SuitValues"], function (require, exports, PointCalculator_21, BidResponse_5, BidCollection_32, SuitValues_19) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond1NT = void 0;
    class Respond1NT extends BidResponse_5.BidResponse {
        constructor(a, h) {
            super(a, h);
            this.fourthOvercalled = false;
            this.pc = new PointCalculator_21.PointCalculator(this.hand);
        }
        prepareBid() {
            let longer = SuitValues_19.Hearts;
            const hearts = this.hand.getSuitLength(SuitValues_19.Hearts);
            const spades = this.hand.getSuitLength(SuitValues_19.Spades);
            let length = hearts;
            if (spades > hearts) {
                longer = SuitValues_19.Spades;
                length = spades;
            }
            const points = this.fourthOvercalled ? this.pc.getCombinedPoints() - 3 : this.pc.getCombinedPoints();
            if (length > 3) {
                if (length == 5 && (hearts == 4 || spades == 4) && points >= 8 && points <= 9) {
                    return BidCollection_32.BidCollection.TWO_CLUBS_C();
                }
                else if (length == 4) {
                    if (points >= 8) {
                        return BidCollection_32.BidCollection.TWO_CLUBS_C();
                    }
                }
                else if (length >= 6 && points >= 10 && points <= 13) {
                    return BidCollection_32.BidCollection.makeBid(3, longer, true);
                }
                else {
                    if (longer === SuitValues_19.Hearts) {
                        return BidCollection_32.BidCollection.TWO_DIAMONDS_C();
                    }
                    else {
                        return BidCollection_32.BidCollection.TWO_HEARTS_C();
                    }
                }
            }
            longer = SuitValues_19.Clubs;
            const clubs = this.hand.getSuitLength(SuitValues_19.Clubs);
            const diamonds = this.hand.getSuitLength(SuitValues_19.Diamonds);
            length = clubs;
            if (diamonds > clubs) {
                longer = SuitValues_19.Diamonds;
                length = diamonds;
            }
            if (length >= 5) {
                if (points >= 14 || (length >= 6 && points >= 12)) {
                    return BidCollection_32.BidCollection.TWO_CLUBS_C();
                }
                else if (points <= 7 && diamonds >= 5 && (diamonds == 6 || clubs >= 5)) {
                    return BidCollection_32.BidCollection.TWO_SPADES_C(); /* double checked it is spades */
                }
                else if (points >= 10 && clubs >= 4 && diamonds >= 4) {
                    return BidCollection_32.BidCollection.TWO_SPADES_C(); /* double checked it is spades */
                }
                else if (length >= 6 && points >= 6 && points <= 9) {
                    return BidCollection_32.BidCollection.makeBid(3, longer, true);
                }
            }
            const HCP = this.fourthOvercalled ? this.pc.getHighCardPoints() - 3 : this.pc.getHighCardPoints();
            if (HCP <= 7) {
                return BidCollection_32.BidCollection.PASS;
            }
            else if (HCP <= 9 && this.pc.isSemiBalanced()) {
                return BidCollection_32.BidCollection.TWO_NOTRUMP_C();
            }
            else if (HCP <= 15 && this.pc.isSemiBalanced()) {
                return BidCollection_32.BidCollection.THREE_NOTRUMP_C();
            }
            return null;
        }
        applies() {
            if (super.applies() && BidCollection_32.BidCollection.ONE_NOTRUMP_C().equals(this.partnersOpeningBid)) {
                if (this.auction.isFourthOvercall(this.partnersOpeningBid)) {
                    this.fourthOvercalled = true;
                }
                return true;
            }
            return false;
        }
    }
    exports.Respond1NT = Respond1NT;
});
define("core/bidding/rules/Respond2C", ["require", "exports", "core/deck/SuitCollection", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BidResponse"], function (require, exports, SuitCollection_15, BidCollection_33, PointCalculator_22, BidResponse_6) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond2C = void 0;
    class Respond2C extends BidResponse_6.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        prepareBid() {
            this.pc = new PointCalculator_22.PointCalculator(this.hand);
            let result = null;
            if (this.pc.getHighCardPoints() >= 8) {
                let longest = null;
                SuitCollection_15.SuitCollection.mmList.forEach((color) => {
                    if (this.hand.getSuitLength(color) >= 5) {
                        if (this.hand.AisStronger(color, longest)) {
                            longest = color;
                        }
                    }
                });
                if (longest != null) {
                    if (longest.isMajorSuit()) {
                        result = BidCollection_33.BidCollection.makeBid(2, longest, true);
                        result.makeGameForcing();
                    }
                    else {
                        result = BidCollection_33.BidCollection.makeBid(3, longest, true);
                        result.makeGameForcing();
                    }
                }
                if (result == null && this.pc.isBalanced()) {
                    result = BidCollection_33.BidCollection.TWO_NOTRUMP_C();
                    result.makeGameForcing();
                }
            }
            if (result == null) {
                result = BidCollection_33.BidCollection.TWO_DIAMONDS_C();
            }
            return result;
        }
        applies() {
            return super.applies() && BidCollection_33.BidCollection.TWO_CLUBS.equals(this.partnersOpeningBid) && this.auction.isOpening(this.partnersOpeningBid);
        }
    }
    exports.Respond2C = Respond2C;
});
define("core/bidding/rules/Respond2NT", ["require", "exports", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BidResponse"], function (require, exports, SuitValues_20, BidCollection_34, PointCalculator_23, BidResponse_7) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Respond2NT = void 0;
    class Respond2NT extends BidResponse_7.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        prepareBid() {
            this.pc = new PointCalculator_23.PointCalculator(this.hand);
            let result = null;
            let longer = SuitValues_20.Hearts;
            let length = this.hand.getSuitLength(SuitValues_20.Hearts);
            if (this.hand.getSuitLength(SuitValues_20.Spades) > length) {
                longer = SuitValues_20.Spades;
                length = this.hand.getSuitLength(SuitValues_20.Spades);
            }
            const points = this.pc.getCombinedPoints();
            if (length > 3) {
                if (length == 4) {
                    if (points >= 5) {
                        result = BidCollection_34.BidCollection.THREE_CLUBS_C();
                    }
                }
                else if (longer === SuitValues_20.Hearts) {
                    result = BidCollection_34.BidCollection.THREE_DIAMONDS_C();
                }
                else {
                    result = BidCollection_34.BidCollection.THREE_HEARTS_C();
                }
            }
            if (result == null) {
                if (this.pc.getHighCardPoints() >= 5) {
                    result = BidCollection_34.BidCollection.THREE_NOTRUMP_C();
                }
                else {
                    result = BidCollection_34.BidCollection.PASS;
                }
            }
            return result;
        }
        applies() {
            return super.applies() && BidCollection_34.BidCollection.TWO_NOTRUMP.equals(this.partnersOpeningBid);
        }
    }
    exports.Respond2NT = Respond2NT;
});
define("core/bidding/rules/RespondOvercallSuit", ["require", "exports", "core/bidding/ResponseCalculator", "core/bidding/rules/BidResponse", "core/bidding/BidCollection", "core/deck/NoTrump"], function (require, exports, ResponseCalculator_9, BidResponse_8, BidCollection_35, NoTrump_14) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RespondOvercallSuit = void 0;
    class RespondOvercallSuit extends BidResponse_8.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            return super.applies() && this.auction.isOvercall(this.partnersOpeningBid) && this.partnersOpeningBid.trump.isSuit();
        }
        prepareBid() {
            const calc = new ResponseCalculator_9.ResponseCalculator(this.hand, this.partnersOpeningBid);
            const points = calc.getCombinedPoints();
            const level = this.partnersOpeningBid.value;
            const length = this.hand.getSuitLength(this.partnersOpeningBid.trump);
            if (length >= 3) {
                if (length != 3 && points <= 7 && level == 1 && this.auction.getVulnerabilityIndex() < 2) {
                    return BidCollection_35.BidCollection.makeBid(3, this.partnersOpeningBid.trump, true);
                }
                else if (points >= 7 && points <= 14) {
                    const result = BidCollection_35.BidCollection.makeBid(level + 1, this.partnersOpeningBid.trump, true);
                    if (this.auction.isValid(result)) {
                        return result;
                    }
                }
                else if (points >= 15) {
                    return BidCollection_35.BidCollection.makeBid(RespondOvercallSuit.MAJOR_SUIT_GAME, this.partnersOpeningBid.trump, true);
                }
            }
            if (points >= 8) {
                if (level == 1) {
                    if (points >= 10) {
                        let result = null;
                        this.hand.getSuitsWithAtLeastCards(5).forEach((color) => {
                            if (!result && this.auction.isValid(BidCollection_35.BidCollection.makeBid(2, color, false))) {
                                result = BidCollection_35.BidCollection.makeBid(2, color, true);
                            }
                        });
                        if (result)
                            return result;
                        if (points <= 12 && calc.isBalanced())
                            return this.makeCheapestBid(NoTrump_14.NoTrump);
                    }
                    else if (calc.isBalanced() && this.haveStopperInEnemySuit()) {
                        return this.makeCheapestBid(NoTrump_14.NoTrump);
                    }
                    else {
                        let result = null;
                        this.hand.getSuitsWithAtLeastCards(4).forEach((color) => {
                            if (!result && this.auction.isValid(BidCollection_35.BidCollection.makeBid(1, color, false))) {
                                result = BidCollection_35.BidCollection.makeBid(1, color, true);
                            }
                        });
                        return result;
                    }
                }
                if (level == 2) {
                    let result = null;
                    this.hand.getDecent5LengthSuits().forEach((color) => {
                        if (!result) {
                            if (points >= 13) {
                                result = BidCollection_35.BidCollection.makeBid(3, color, true);
                            }
                            else if (this.auction.isValid(BidCollection_35.BidCollection.makeBid(2, color, false))) {
                                result = BidCollection_35.BidCollection.makeBid(2, color, true);
                            }
                        }
                    });
                    return result;
                }
            }
            if (level <= 3 && this.haveStopperInEnemySuit()) {
                if (level == 3) {
                    if (points >= 18 && calc.isSemiBalanced()) {
                        return BidCollection_35.BidCollection.makeBid(RespondOvercallSuit.NOTRUMP_GAME, NoTrump_14.NoTrump, true);
                    }
                }
                else {
                    if (points >= 8 && points <= 11) {
                        return this.makeCheapestBid(NoTrump_14.NoTrump);
                    }
                    if (points >= 12 && points <= 14) {
                        const bid = this.makeCheapestBid(NoTrump_14.NoTrump);
                        return BidCollection_35.BidCollection.makeBid(bid.value + 1, NoTrump_14.NoTrump, true);
                    }
                    if (points >= 15) {
                        return BidCollection_35.BidCollection.makeBid(RespondOvercallSuit.NOTRUMP_GAME, NoTrump_14.NoTrump, true);
                    }
                }
            }
            return null;
        }
        makeCheapestBid(trump) {
            const candidate = BidCollection_35.BidCollection.makeBid(this.partnersOpeningBid.value, trump, true);
            if (this.auction.isValid(candidate)) {
                return candidate;
            }
            else {
                return BidCollection_35.BidCollection.makeBid(this.partnersOpeningBid.value + 1, trump, true);
            }
        }
    }
    exports.RespondOvercallSuit = RespondOvercallSuit;
    RespondOvercallSuit.MAJOR_SUIT_GAME = 4;
    RespondOvercallSuit.NOTRUMP_GAME = 3;
});
define("core/bidding/rules/RespondPreemptiveBid", ["require", "exports", "core/bidding/TrickCalculator", "core/bidding/rules/BidResponse", "core/bidding/BidCollection", "core/deck/SuitCollection"], function (require, exports, TrickCalculator_2, BidResponse_9, BidCollection_36, SuitCollection_16) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RespondPreemptiveBid = void 0;
    class RespondPreemptiveBid extends BidResponse_9.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (super.applies() && (this.auction.isOpening(this.partnersOpeningBid) || (this.auction.isOvercall(this.partnersOpeningBid) && this.auction.enemyCallBeforePartner(null).getBid().is1Suit()))) {
                return this.partnersOpeningBid.value == 3 && this.partnersOpeningBid.trump.isSuit() && this.hand.getSuitLength(this.partnersOpeningBid.trump) != 0;
            }
            return false;
        }
        prepareBid() {
            const calc = new TrickCalculator_2.TrickCalculator(this.hand);
            const suit = this.partnersOpeningBid.trump;
            const vulnerabilityIndex = this.auction.getVulnerabilityIndex();
            let doubledTricks = 0;
            SuitCollection_16.SuitCollection.list.forEach((color) => {
                doubledTricks += calc.doublePlayingTricks(color);
            });
            if (suit.isMajorSuit()) {
                if ((vulnerabilityIndex == 2 && doubledTricks > 4) || (vulnerabilityIndex == 1 && doubledTricks > 8) || (vulnerabilityIndex == 0 && doubledTricks > 6)) {
                    return BidCollection_36.BidCollection.makeBid(4, suit, true);
                }
            }
            else {
                if ((vulnerabilityIndex == 2 && doubledTricks > 6) || (vulnerabilityIndex == 1 && doubledTricks > 10) || (vulnerabilityIndex == 0 && doubledTricks > 8)) {
                    return BidCollection_36.BidCollection.makeBid(5, suit, true);
                }
            }
            if ((vulnerabilityIndex == 2 && doubledTricks > 2) || (vulnerabilityIndex == 1 && doubledTricks > 6) || (vulnerabilityIndex == 0 && doubledTricks > 4)) {
                if (this.hand.getSuitLength(suit) >= 3) {
                    let possible = true;
                    SuitCollection_16.SuitCollection.list.forEach((color) => {
                        if (possible && color !== suit && (this.hand.getSuitLength(color) < 2 || !this.hand.haveStrongStopper(color))) {
                            possible = false;
                        }
                    });
                    if (possible) {
                        return BidCollection_36.BidCollection.THREE_NOTRUMP_C();
                    }
                }
                const colorResult = SuitCollection_16.SuitCollection.mmList.find((color) => {
                    if (color !== suit && this.hand.getSuitLength(color) >= 6 && this.hand.isDecent5LengthSuits(color)) {
                        return this.auction.isValid(BidCollection_36.BidCollection.makeBid(3, color, false));
                    }
                    return false;
                });
                if (colorResult)
                    return BidCollection_36.BidCollection.makeBid(3, colorResult, true);
            }
            return BidCollection_36.BidCollection.PASS;
        }
    }
    exports.RespondPreemptiveBid = RespondPreemptiveBid;
});
define("core/bidding/rules/RespondTakeoutDouble", ["require", "exports", "core/deck/SuitCollection", "core/deck/SuitValues", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, SuitCollection_17, SuitValues_21, BidCollection_37, PointCalculator_24, BiddingRule_12) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RespondTakeoutDouble = void 0;
    class RespondTakeoutDouble extends BiddingRule_12.BiddingRule {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (this.auction.getPartnersLastCall() == null) {
                return false;
            }
            const partnersBid = this.auction.getPartnersLastCall().getBid();
            if (this.auction.isOvercall(partnersBid) && partnersBid.isDouble()) {
                this.lastBid = this.auction.enemyCallBeforePartner(null).getBid();
                if (this.lastBid.value < 4 && !this.lastBid.trump.isNoTrump()) {
                    return true;
                }
            }
            return false;
        }
        prepareBid() {
            this.pc = new PointCalculator_24.PointCalculator(this.hand);
            let result = null;
            this.highest = this.longestSuit();
            const HCP = this.pc.getHighCardPoints();
            if (HCP < 3)
                return BidCollection_37.BidCollection.PASS;
            if (HCP <= 12 && this.highest != null) {
                result = BidCollection_37.BidCollection.makeBid(this.levelToBid(), this.highest, true);
                if (!this.auction.isValid(result)) {
                    if (HCP >= 9) {
                        result = BidCollection_37.BidCollection.makeBid(this.levelToBid() + 1, this.highest, true);
                    }
                    else {
                        if (this.hand.getSuitLength(SuitValues_21.Hearts) >= 4) {
                            this.highest = SuitValues_21.Hearts;
                            result = BidCollection_37.BidCollection.makeBid(this.levelToBid(), this.highest, true);
                        }
                        if (!this.auction.isValid(result) && this.hand.getSuitLength(SuitValues_21.Spades) >= 4) {
                            this.highest = SuitValues_21.Spades;
                            result = BidCollection_37.BidCollection.makeBid(this.levelToBid(), this.highest, true);
                            if (!this.auction.isValid(result)) {
                                result = null;
                            }
                        }
                    }
                }
                if (result != null) {
                    return result;
                }
            }
            if (HCP >= 6 && this.haveStopperInEnemySuit()) {
                if (HCP < 10) {
                    return BidCollection_37.BidCollection.ONE_NOTRUMP_C();
                }
                else if (HCP <= 12) {
                    return BidCollection_37.BidCollection.TWO_NOTRUMP_C();
                }
                else if (HCP <= 16) {
                    return BidCollection_37.BidCollection.THREE_NOTRUMP_C();
                }
            }
            const enemy = this.lastBid.trump;
            if (HCP >= 10) {
                return BidCollection_37.BidCollection.makeBid(this.lastBid.value + 1, enemy, true);
            }
            else if (this.hand.isGood5LengthSuits(enemy)) {
                return BidCollection_37.BidCollection.PASS;
            }
            else {
                return this.makeCheapestBid(this.desperateSuit());
            }
        }
        longestSuit() {
            let longest = null;
            SuitCollection_17.SuitCollection.list.forEach((color) => {
                if (this.enemyHasBid(color) && (this.hand.getSuitLength(color) >= 5 || (this.hand.getSuitLength(color)) == 4 && color.isMajorSuit())) {
                    if (this.hand.AisStronger(color, longest)) {
                        longest = color;
                    }
                }
            });
            return longest;
        }
        desperateSuit() {
            let longest = null;
            SuitCollection_17.SuitCollection.list.forEach((color) => {
                if (this.enemyHasBid(color) && this.hand.getSuitLength(color) >= 3) {
                    if (this.hand.AisStronger(color, longest)) {
                        longest = color;
                    }
                }
            });
            return longest;
        }
        enemyHasBid(suit) {
            return this.auction.getEnemyTrumps().contains(suit);
        }
        levelToBid() {
            if (this.lastBid.greaterThan(BidCollection_37.BidCollection.makeBid(this.lastBid.value, this.highest, true))) {
                return this.lastBid.value + 1;
            }
            else {
                return this.lastBid.value;
            }
        }
        makeCheapestBid(trump) {
            if (trump == null) {
                return null;
            }
            const candidate = BidCollection_37.BidCollection.makeBid(this.lastBid.value, trump, true);
            if (this.auction.isValid(candidate)) {
                return candidate;
            }
            else {
                return BidCollection_37.BidCollection.makeBid(this.lastBid.value + 1, trump, true);
            }
        }
    }
    exports.RespondTakeoutDouble = RespondTakeoutDouble;
});
define("core/bidding/rules/RespondWeakTwo", ["require", "exports", "core/bidding/ResponseCalculator", "core/bidding/rules/BidResponse", "core/bidding/BidCollection", "core/deck/SuitCollection", "core/deck/SuitValues"], function (require, exports, ResponseCalculator_10, BidResponse_10, BidCollection_38, SuitCollection_18, SuitValues_22) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RespondWeakTwo = void 0;
    class RespondWeakTwo extends BidResponse_10.BidResponse {
        constructor(a, h) {
            super(a, h);
        }
        applies() {
            if (super.applies() && this.auction.isOpening(this.partnersOpeningBid) && this.partnersOpeningBid.value == 2 && this.partnersOpeningBid.trump !== SuitValues_22.Clubs && this.partnersOpeningBid.trump.isSuit()) {
                this.calc = new ResponseCalculator_10.ResponseCalculator(this.hand, this.partnersOpeningBid);
                return this.calc.getCombinedPoints() >= 8;
            }
            return false;
        }
        prepareBid() {
            const points = this.calc.getCombinedPoints();
            if (this.partnersOpeningBid.trump === SuitValues_22.Diamonds) {
                if (points < 10) {
                    return null;
                }
                let result = null;
                let noMoreAnalysis = false;
                SuitCollection_18.SuitCollection.mmList.forEach((color) => {
                    if (noMoreAnalysis)
                        return;
                    if (color !== SuitValues_22.Diamonds && (this.hand.getSuitLength(color) >= 6 || this.hand.isDecent5LengthSuits(color))) {
                        if (points >= 16) {
                            result = BidCollection_38.BidCollection.TWO_NOTRUMP_C();
                            noMoreAnalysis = true;
                        }
                        else {
                            if (color === SuitValues_22.Clubs && this.hand.getSuitLength(SuitValues_22.Diamonds) < 3) {
                                result = BidCollection_38.BidCollection.makeBid(3, color, true);
                            }
                            else {
                                result = BidCollection_38.BidCollection.makeBid(2, color, true);
                            }
                        }
                    }
                });
                if (this.auction.isValid(result)) {
                    return result;
                }
                if (this.hand.getSuitLength(SuitValues_22.Diamonds) >= 3) {
                    if (points >= 16) {
                        return BidCollection_38.BidCollection.TWO_NOTRUMP_C();
                    }
                    else {
                        return BidCollection_38.BidCollection.THREE_DIAMONDS_C(); /* this was 2D not 3D in earlier versions */
                    }
                }
            }
            else {
                const suit = this.partnersOpeningBid.trump;
                if (points < 8) {
                    return null;
                }
                if (this.hand.getSuitLength(suit) >= 3) {
                    if (points <= 13) {
                        return BidCollection_38.BidCollection.makeBid(3, suit, true);
                    }
                    else if (points <= 16) {
                        return BidCollection_38.BidCollection.TWO_NOTRUMP_C();
                    }
                    else if (points <= 19) {
                        return BidCollection_38.BidCollection.makeBid(4, suit, true);
                    }
                    else {
                        return BidCollection_38.BidCollection.TWO_NOTRUMP_C();
                    }
                }
                let result = null;
                SuitCollection_18.SuitCollection.mmList.forEach((color) => {
                    if (color !== suit && (this.hand.getSuitLength(color) >= 6 || this.hand.isDecent5LengthSuits(color))) {
                        if (points >= 16) {
                            result = BidCollection_38.BidCollection.TWO_NOTRUMP_C();
                        }
                        else {
                            if (color === SuitValues_22.Spades && suit === SuitValues_22.Hearts) {
                                result = BidCollection_38.BidCollection.makeBid(2, color, true);
                            }
                            else if (this.hand.getSuitLength(suit) < 2) {
                                result = BidCollection_38.BidCollection.makeBid(3, color, true);
                            }
                        }
                    }
                });
                if (this.auction.isValid(result)) {
                    return result;
                }
            }
            const HCP = this.calc.getHighCardPoints();
            if (HCP >= 14) {
                if (HCP >= 16 && this.calc.isSemiBalanced()) {
                    let allStopped = true;
                    SuitCollection_18.SuitCollection.list.forEach((color) => {
                        if (allStopped && color !== SuitValues_22.Diamonds && !this.hand.haveStopper(color)) {
                            allStopped = false;
                        }
                    });
                    if (allStopped) {
                        return BidCollection_38.BidCollection.THREE_NOTRUMP_C();
                    }
                }
                return BidCollection_38.BidCollection.TWO_NOTRUMP_C();
            }
            return null;
        }
    }
    exports.RespondWeakTwo = RespondWeakTwo;
});
define("core/bidding/rules/Strong2C", ["require", "exports", "core/bidding/BidCollection", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule"], function (require, exports, BidCollection_39, PointCalculator_25, BiddingRule_13) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Strong2C = void 0;
    class Strong2C extends BiddingRule_13.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_25.PointCalculator(this.hand);
        }
        prepareBid() {
            return BidCollection_39.BidCollection.TWO_CLUBS_C();
        }
        applies() {
            return this.auction.isOpeningBid() && this.pc.getCombinedPoints() >= 23;
        }
    }
    exports.Strong2C = Strong2C;
});
define("core/bidding/rules/TakeoutDouble", ["require", "exports", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule", "core/bidding/BidCollection", "core/deck/SuitCollection"], function (require, exports, PointCalculator_26, BiddingRule_14, BidCollection_40, SuitCollection_19) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TakeoutDouble = void 0;
    class TakeoutDouble extends BiddingRule_14.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_26.PointCalculator(this.hand);
        }
        applies() {
            const HCP = this.pc.getHighCardPoints();
            if ((this.auction.may2ndOvercall() && HCP >= 12) || (this.auction.may4thOvercall() && HCP >= 8)) {
                if (this.auction.getHighBid().trump.isNoTrump()) {
                    if (HCP >= 16 && this.pc.isSemiBalanced()) {
                        let allStopped = true;
                        SuitCollection_19.SuitCollection.list.forEach((color) => {
                            if (allStopped && !this.hand.haveStopper(color)) {
                                allStopped = false;
                            }
                        });
                        if (allStopped) {
                            return true;
                        }
                    }
                }
                else {
                    return HCP >= 16 || (HCP == 15 && this.auction.may4thOvercall()) || this.EachUnbidSuitWithAtLeast3Cards();
                }
            }
            return false;
        }
        prepareBid() {
            return BidCollection_40.BidCollection.cloneBid(BidCollection_40.BidCollection.DOUBLE);
        }
        EachUnbidSuitWithAtLeast3Cards() {
            return !SuitCollection_19.SuitCollection.list.find(color => (this.hasNotBeenBid(color) && this.hand.getSuitLength(color) < 3));
        }
        hasNotBeenBid(suit) {
            const enemyTrumps = this.auction.getEnemyTrumps();
            let result = false;
            enemyTrumps.forEach((trump) => {
                if (suit === trump) {
                    result = true;
                }
            });
            return result;
        }
    }
    exports.TakeoutDouble = TakeoutDouble;
});
define("core/bidding/rules/WeakTwo", ["require", "exports", "core/Card", "core/bidding/PointCalculator", "core/bidding/rules/BiddingRule", "core/bidding/BidCollection", "core/deck/SuitValues"], function (require, exports, Card_5, PointCalculator_27, BiddingRule_15, BidCollection_41, SuitValues_23) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.WeakTwo = void 0;
    class WeakTwo extends BiddingRule_15.BiddingRule {
        constructor(a, h) {
            super(a, h);
            this.pc = new PointCalculator_27.PointCalculator(this.hand);
        }
        applies() {
            if (this.auction.isOpeningBid() && this.pc.getHighCardPoints() >= 6) {
                this.sixCardSuit = this.hand.getLongestSuit();
                const cards = this.hand.getSuitHi2Low(this.sixCardSuit);
                if (this.sixCardSuit === SuitValues_23.Clubs || this.hand.getSuitLength(this.sixCardSuit) < 6 || cards[0].value < Card_5.Card.KING) {
                    return false;
                }
                if (this.auction.getVulnerabilityIndex() >= 2) {
                    let bigThree = 0, bigFive = 0;
                    for (let i = 0; i < 5; ++i) {
                        const value = cards[i].value;
                        if (value >= Card_5.Card.QUEEN) {
                            bigThree++;
                        }
                        if (value >= Card_5.Card.TEN) {
                            bigFive++;
                        }
                    }
                    if (bigThree < 2 && bigFive < 3) {
                        return false;
                    }
                }
                if (this.sixCardSuit !== SuitValues_23.Hearts && this.hand.getSuitLength(SuitValues_23.Hearts) >= 4 && this.hand.getSuitHi2Low(SuitValues_23.Hearts)[0].value >= Card_5.Card.QUEEN) {
                    return false;
                }
                if (this.sixCardSuit !== SuitValues_23.Spades && this.hand.getSuitLength(SuitValues_23.Spades) >= 4 && this.hand.getSuitHi2Low(SuitValues_23.Spades)[0].value >= Card_5.Card.QUEEN) {
                    return false;
                }
                return true;
            }
            return false;
        }
        prepareBid() {
            return BidCollection_41.BidCollection.makeBid(2, this.sixCardSuit, true);
        }
    }
    exports.WeakTwo = WeakTwo;
});
define("core/bidding/BiddingAgent", ["require", "exports", "core/bidding/rules/AlwaysPass", "core/bidding/rules/Open1Color", "core/bidding/rules/Open1NT", "core/bidding/rules/Open2NT", "core/bidding/rules/Overcall1NT", "core/bidding/rules/OvercallSuit", "core/bidding/rules/PRebidAfter1NT", "core/bidding/rules/PRebidToCorrect", "core/bidding/rules/PRebidWeakTwo", "core/bidding/rules/PreemptiveBid", "core/bidding/rules/Rebid1ColorOriginalSuit", "core/bidding/rules/Rebid1ColorRaiseOpener", "core/bidding/rules/Rebid1ColorRaisePartner", "core/bidding/rules/Rebid1ColorWithNewSuit", "core/bidding/rules/Rebid1ColorWithNT", "core/bidding/rules/Rebid1NT", "core/bidding/rules/Rebid2C", "core/bidding/rules/Rebid2NT", "core/bidding/rules/RebidAfter1NT", "core/bidding/rules/RebidAfterForcing1NT", "core/bidding/rules/RebidForcing1NT", "core/bidding/rules/RebidJacobyTransfer", "core/bidding/rules/RebidMinorSuitStayman", "core/bidding/rules/RebidStayman", "core/bidding/rules/RebidTakeoutDouble", "core/bidding/rules/RebidWeakTwo", "core/bidding/rules/Respond1ColorRaiseMajorSuit", "core/bidding/rules/Respond1ColorRaiseMinorSuit", "core/bidding/rules/Respond1ColorWithNewSuit", "core/bidding/rules/Respond1ColorWithNT", "core/bidding/rules/Respond1NT", "core/bidding/rules/Respond2C", "core/bidding/rules/Respond2NT", "core/bidding/rules/RespondOvercallSuit", "core/bidding/rules/RespondPreemptiveBid", "core/bidding/rules/RespondTakeoutDouble", "core/bidding/rules/RespondWeakTwo", "core/bidding/rules/Strong2C", "core/bidding/rules/TakeoutDouble", "core/bidding/rules/WeakTwo"], function (require, exports, AlwaysPass_1, Open1Color_1, Open1NT_1, Open2NT_1, Overcall1NT_1, OvercallSuit_1, PRebidAfter1NT_1, PRebidToCorrect_1, PRebidWeakTwo_1, PreemptiveBid_1, Rebid1ColorOriginalSuit_1, Rebid1ColorRaiseOpener_1, Rebid1ColorRaisePartner_1, Rebid1ColorWithNewSuit_1, Rebid1ColorWithNT_1, Rebid1NT_1, Rebid2C_1, Rebid2NT_1, RebidAfter1NT_1, RebidAfterForcing1NT_1, RebidForcing1NT_1, RebidJacobyTransfer_1, RebidMinorSuitStayman_1, RebidStayman_1, RebidTakeoutDouble_1, RebidWeakTwo_1, Respond1ColorRaiseMajorSuit_1, Respond1ColorRaiseMinorSuit_1, Respond1ColorWithNewSuit_1, Respond1ColorWithNT_1, Respond1NT_1, Respond2C_1, Respond2NT_1, RespondOvercallSuit_1, RespondPreemptiveBid_1, RespondTakeoutDouble_1, RespondWeakTwo_1, Strong2C_1, TakeoutDouble_1, WeakTwo_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BiddingAgent = void 0;
    class BiddingAgent {
        constructor(a, h) {
            this.rules = [];
            this.rules.push(new Strong2C_1.Strong2C(a, h));
            this.rules.push(new Open2NT_1.Open2NT(a, h));
            this.rules.push(new Open1NT_1.Open1NT(a, h));
            this.rules.push(new Open1Color_1.Open1Color(a, h));
            this.rules.push(new OvercallSuit_1.OvercallSuit(a, h));
            this.rules.push(new Overcall1NT_1.Overcall1NT(a, h));
            this.rules.push(new TakeoutDouble_1.TakeoutDouble(a, h));
            this.rules.push(new PreemptiveBid_1.PreemptiveBid(a, h));
            this.rules.push(new WeakTwo_1.WeakTwo(a, h));
            this.rules.push(new RespondPreemptiveBid_1.RespondPreemptiveBid(a, h));
            this.rules.push(new RespondWeakTwo_1.RespondWeakTwo(a, h));
            this.rules.push(new RespondOvercallSuit_1.RespondOvercallSuit(a, h));
            this.rules.push(new RespondTakeoutDouble_1.RespondTakeoutDouble(a, h));
            this.rules.push(new Respond2C_1.Respond2C(a, h));
            this.rules.push(new Respond2NT_1.Respond2NT(a, h));
            this.rules.push(new Respond1NT_1.Respond1NT(a, h));
            this.rules.push(new Respond1ColorRaiseMajorSuit_1.Respond1ColorRaiseMajorSuit(a, h));
            this.rules.push(new Respond1ColorWithNewSuit_1.Respond1ColorWithNewSuit(a, h));
            this.rules.push(new Respond1ColorRaiseMinorSuit_1.Respond1ColorRaiseMinorSuit(a, h));
            this.rules.push(new Respond1ColorWithNT_1.Respond1ColorWithNT(a, h));
            this.rules.push(new RebidWeakTwo_1.RebidWeakTwo(a, h));
            this.rules.push(new RebidTakeoutDouble_1.RebidTakeoutDouble(a, h));
            this.rules.push(new Rebid2C_1.Rebid2C(a, h));
            this.rules.push(new Rebid2NT_1.Rebid2NT(a, h));
            this.rules.push(new Rebid1NT_1.Rebid1NT(a, h));
            this.rules.push(new RebidAfterForcing1NT_1.RebidAfterForcing1NT(a, h));
            this.rules.push(new Rebid1ColorRaiseOpener_1.Rebid1ColorRaiseOpener(a, h));
            this.rules.push(new Rebid1ColorRaisePartner_1.Rebid1ColorRaisePartner(a, h));
            this.rules.push(new Rebid1ColorWithNT_1.Rebid1ColorWithNT(a, h));
            this.rules.push(new Rebid1ColorWithNewSuit_1.Rebid1ColorWithNewSuit(a, h));
            this.rules.push(new Rebid1ColorOriginalSuit_1.Rebid1ColorOriginalSuit(a, h));
            this.rules.push(new RebidAfter1NT_1.RebidAfter1NT(a, h));
            this.rules.push(new PRebidWeakTwo_1.PRebidWeakTwo(a, h));
            this.rules.push(new RebidStayman_1.RebidStayman(a, h));
            this.rules.push(new RebidJacobyTransfer_1.RebidJacobyTransfer(a, h));
            this.rules.push(new RebidMinorSuitStayman_1.RebidMinorSuitStayman(a, h));
            this.rules.push(new RebidForcing1NT_1.RebidForcing1NT(a, h));
            this.rules.push(new PRebidAfter1NT_1.PRebidAfter1NT(a, h));
            this.rules.push(new PRebidToCorrect_1.PRebidToCorrect(a, h));
            this.rules.push(new AlwaysPass_1.AlwaysPass());
        }
        getBid() {
            let result = null;
            const rule = this.rules.find((rule) => {
                result = rule.getBid();
                return result;
            });
            console.log("rule: " + rule.constructor.name + " recommends: " + result);
            return result;
        }
    }
    exports.BiddingAgent = BiddingAgent;
});
/* This file only under CC0 - public domain */
define("api/interfaces", ["require", "exports", "core/Direction"], function (require, exports, Direction_3) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ApiDirection = exports.keyToGnubridgeDirection = exports.directionToKey = void 0;
    exports.directionToKey = {
        N: 'north',
        E: 'east',
        S: 'south',
        W: 'west'
    };
    exports.keyToGnubridgeDirection = {
        'north': Direction_3.Direction.NORTH,
        'east': Direction_3.Direction.EAST,
        'south': Direction_3.Direction.SOUTH,
        'west': Direction_3.Direction.WEST
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
/* This file only under CC0 - public domain */
define("api/bidding", ["require", "exports", "core/bidding/Auctioneer", "core/bidding/BidCollection", "core/bidding/BiddingAgent", "core/Card", "core/Direction", "core/Hand", "api/interfaces"], function (require, exports, Auctioneer_1, BidCollection_42, BiddingAgent_1, Card_6, Direction_4, Hand_1, interfaces_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    function getComputerBid(dealtHands, contract) {
        let auctioneer;
        for (let i = 0; contract && contract.north[i] !== undefined; i++) {
            ['north', 'east', 'south', 'west'].forEach(key => {
                if (contract[key][i] && contract[key][i] !== ' ') {
                    if (!auctioneer)
                        auctioneer = new Auctioneer_1.Auctioneer(Direction_4.DirectionCollection.instance(interfaces_1.keyToGnubridgeDirection[key]));
                    auctioneer.bid(BidCollection_42.BidCollection.fromUniversal(contract[key][i]));
                }
            });
        }
        if (!auctioneer)
            auctioneer = new Auctioneer_1.Auctioneer(Direction_4.DirectionCollection.fromUniversal(dealtHands.nextToPlay));
        const key = interfaces_1.directionToKey[dealtHands.nextToPlay];
        const agent = new BiddingAgent_1.BiddingAgent(auctioneer, new Hand_1.Hand(dealtHands[key].map(c => Card_6.Card.get(c))));
        return BidCollection_42.BidCollection.toUniversal(agent.getBid());
    }
    onmessage = function (e) {
        const localDealtHands = JSON.parse(JSON.stringify(e.data.dealtHands));
        const localContract = e.data.contract ? JSON.parse(JSON.stringify(e.data.contract)) : undefined;
        const result = getComputerBid(localDealtHands, localContract);
        postMessage(result, undefined);
    };
});
/* End CC0 */

if (requireAndRun) requireAndRun("api/bidding");
else require("api/bidding");
