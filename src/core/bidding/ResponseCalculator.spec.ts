import { Spades, Hearts } from "../deck/SuitValues";
import { Hand } from "../Hand";
import { BidCollection } from "./BidCollection";
import { ResponseCalculator } from "./ResponseCalculator";


describe('Response Calculator', () => {

    it('singleton', () => {
      const h = Hand.fromSuits("6,5,4,3", "10,9,8,7,2", "7,6,2", "9");
      const pc = new ResponseCalculator(h, BidCollection.makeBid(1, Spades, false));
      expect(pc.getCombinedPoints()).toBe(3);
    });

    it('only apply if have at least4 in partners color', () => {
      const h = Hand.fromSuits("6,5,4", "10,9,8,7,2", "7,6,3,2","9" );
      const pc = new ResponseCalculator(h, BidCollection.makeBid(1, Spades, false));
      expect(pc.getCombinedPoints()).toBe(2);
    });

    it('test void', () => {
      const h = Hand.fromSuits("", "10,9,8,7,2", "7,6,2", "10,9,8,7,6" );
      const pc = new ResponseCalculator(h, BidCollection.makeBid(1, Hearts, false));
      expect(pc.getCombinedPoints()).toBe(5);
    });

    it('do not count distributional points in partners color', () => {
      const h = Hand.fromSuits("", "10,9,8,7,2", "7,6,2", "10,9,8,7,6" );
      const pc = new ResponseCalculator(h, BidCollection.makeBid(1, Spades, false));
      expect(pc.getCombinedPoints()).toBe(0);
    });

});

