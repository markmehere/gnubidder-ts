import { Four, Five, Ace, King, Two, Three } from "./deck/CardValues";
import { Hearts, Diamonds, Clubs, Spades } from "./deck/SuitValues";
import { Hand } from "./Hand";


describe("core.Hand", () => {

  it("test fromSuits and length", () => {
    const h = Hand.fromSuits("", "", "4,3,2", "A,K");
    expect(h.getSuitLength(Hearts)).toBe(0);
    expect(h.getSuitLength(Diamonds)).toBe(3);
    expect(h.contains(Four.of(Diamonds))).toBe(true);
    expect(h.contains(Five.of(Diamonds))).toBe(false);
    expect(h.contains(Four.of(Clubs))).toBe(false);
    expect(h.contains(Ace.of(Clubs))).toBe(true);
    expect(h.contains(Ace.of(Spades))).toBe(false);
  });

  it("test getSuitHi2Low", () => {
    const h = new Hand([ King.of(Hearts), Two.of(Diamonds), 
      Ace.of(Diamonds), Three.of(Clubs), Three.of(Diamonds) ]);
    const actual = h.getSuitHi2Low(Diamonds);
    expect(actual.length).toBe(3);
    expect(actual[0]).toBe(Ace.of(Diamonds));
    expect(actual[1]).toBe(Three.of(Diamonds));
    expect(actual[2]).toBe(Two.of(Diamonds));
  });

});
