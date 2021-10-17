
import { Ace, Two, King, Queen, Jack, Three } from "../deck/CardValues";
import { Diamonds, Spades, Hearts, Clubs } from "../deck/SuitValues";
import { Hand } from "../Hand";
import { PointCalculator } from "./PointCalculator";
import { RPQuizzes } from "./RPQuizzes";

describe('Point Calculator', () => {

  it('high card points', () => {
    const dh = new PointCalculator(new Hand([Ace.of(Diamonds), Two.of(Spades),
        King.of(Hearts), Queen.of(Hearts), Jack.of(Clubs)]));
    expect(dh.getHighCardPoints()).toBe(10);
  });

  it('get distributional points', () => {
    const dh = new PointCalculator(new Hand([Ace.of(Diamonds), Two.of(Spades),
        King.of(Hearts), Three.of(Spades), Queen.of(Hearts), Jack.of(Hearts)]));
    expect(dh.getDistributionalPoints()).toBe(6);
  });

  it('get combined points flawed colors', () => {
    const dh = new PointCalculator(new Hand([Ace.of(Diamonds), King.of(Clubs),
        Jack.of(Spades), Queen.of(Hearts), Three.of(Spades), Jack.of(Hearts)]));
    expect(dh.getCombinedPoints()).toBe((4 + 2) + 3 + 1 + 3);
  });

  //A balanced Hand.fromSuits contains no singleton or void and at most one doubleton

  it('balanced Hand.fromSuits', () => {
    const h = Hand.fromSuits("A,K,4,3", "K,J,9,2", "6,2", "Q,9,7");
    const pc = new PointCalculator(h);
    expect(pc.isBalanced()).toBe(true);
  });

  it('imbalanced Hand.fromSuits two doubletons', () => {
    const h = Hand.fromSuits("A,K,4,3", "K,J,9,7,2", "6,2", "Q,9");
    const pc = new PointCalculator(h);
    expect(pc.isBalanced()).toBe(false);
  });

  it('imbalanced Hand.fromSuits singleton', () => {
    const h = Hand.fromSuits("A,K,4,3", "K,J,9,2", "6", "Q,9,7,3");
    const pc = new PointCalculator(h);
    expect(pc.isBalanced()).toBe(false);
  });

  it('imbalanced Hand.fromSuits void', () => {
    const h = Hand.fromSuits("A,K,Q,9,7,4,3", "K,J,9,2", "6,2");
    const pc = new PointCalculator(h);
    expect(pc.isBalanced()).toBe(false);
  });

  //almost balanced Hand.fromSuits patterns such as 4-4-4-1, 5-4-2-2, 5-4-3-1, 6-3-2-2 and 6-3-3-1 shape
  it('tame Hand.fromSuits_4_4_4_1', () => {
    const h = Hand.fromSuits("A,K,4,3", "K,J,9,2", "2", "Q,9,7,6");
    const pc = new PointCalculator(h);
    expect(pc.isTame()).toBe(true);
  });

  it('tame Hand.fromSuits_4_4_4_1_ignore order', () => {
    const h = Hand.fromSuits("2", "A,K,4,3", "K,J,9,2", "Q,9,7,6");
    const pc = new PointCalculator(h);
    expect(pc.isTame()).toBe(true);
  });

  it('tame Hand.fromSuits_5_4_2_2', () => {
    const h = Hand.fromSuits("A,K,4,3,2", "K,J,9,2", "3,2", "Q,9");
    const pc = new PointCalculator(h);
    expect(pc.isTame()).toBe(true);
  });

  it('tame Hand.fromSuits_5_4_3_1', () => {
    const h = Hand.fromSuits("A,3,2", "A,K,4,3,2", "K,J,9,2", "Q");
    const pc = new PointCalculator(h);
    expect(pc.isTame()).toBe(true);
  });

  it('tame Hand.fromSuits_6_3_2_2', () => {
    const h = Hand.fromSuits("A,K,10,7,3,2", "A,K,4", "K,2", "Q,J");
    const pc = new PointCalculator(h);
    expect(pc.isTame()).toBe(true);
  });

  it('tame Hand.fromSuits_6_3_3_1', () => {
    const h = Hand.fromSuits("A,K,10,7,3,2", "A,K,4", "K,J,2", "J");
    const pc = new PointCalculator(h);
    expect(pc.isTame()).toBe(true);
  });

  it('RP1', () => {
    const h = RPQuizzes.Basics.Lesson2.hand1();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(16);
  });

  it('RP2', () => {
    const h = RPQuizzes.Basics.Lesson2.hand2();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(12);
  });

  it('RP3', () => {
    const h = RPQuizzes.Basics.Lesson2.hand3();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(14);
  });

  it('RP4', () => {
    const h = RPQuizzes.Basics.Lesson2.hand4();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(15);
  });

  it('RP5', () => {
    const h = RPQuizzes.Basics.Lesson2.hand5();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(18);
    expect(pc.getHighCardPoints()).toBe(17);
  });

  it('RP6', () => {
    const h = RPQuizzes.Basics.Lesson2.hand6();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(18);
  });

  it('RP7', () => {
    const h = RPQuizzes.Basics.Lesson2.hand7();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(20);
  });

  it('RP8', () => {
    const h = RPQuizzes.Basics.Lesson2.hand8();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(16);
  });

  it('RP9', () => {
    const h = RPQuizzes.Basics.Lesson2.hand9();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(19);
  });

  it('RP10', () => {
    const h = RPQuizzes.Basics.Lesson2.hand10();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(13);
  });

  it('RP11', () => {
    const h = RPQuizzes.Basics.Lesson2.hand11();
    const pc = new PointCalculator(h);
    expect(pc.getHighCardPoints()).toBe(17);
    expect(pc.getCombinedPoints()).toBe(18);
  });

  it('RP12', () => {
    const h = RPQuizzes.Basics.Lesson2.hand12();
    const pc = new PointCalculator(h);
    expect(pc.getCombinedPoints()).toBe(14);
  });

});

