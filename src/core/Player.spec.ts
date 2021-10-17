
import { Player } from "./Player";
import { Direction } from "./Direction";
import { Card } from "./Card";
import { Trick } from "./Trick";
import { Three, Ace, Jack, Queen, Two, Ten, King } from "./deck/CardValues";
import { NoTrump } from "./deck/NoTrump";
import { SuitCollection } from "./deck/SuitCollection";
import { Spades, Hearts, Clubs, Diamonds } from "./deck/SuitValues";

describe("core.Player", () => {

	const dummyPlayer = new Player(Direction.SOUTH);

  it("one player initialization", () => {
		const westSpades = Card.FullSuit;
		const westHearts = [];
		const westDiamonds = [];
		const westClubs = [];
		const west = new Player(Direction.WEST);
		west.initWithExplicits(westSpades, westHearts, westDiamonds, westClubs);
		for (let i = 0; i < westSpades.length; i++) {
			expect(west.hasUnplayedCard(Card.getFromValues(westSpades[i], Spades))).toBe(true);
		}

		for (let j = 1; j < SuitCollection.list.length; j++) {
			for (let i = 0; i < Card.FullSuit.length; i++) {
				expect(west.hasUnplayedCard(Card.getFromValues(Card.FullSuit[i], SuitCollection.list[j]))).toBe(false);
			}
    }
  });

  it("initialization not by reference", () => {
    const westSpades = [ "2" ];
    const westHearts = [];
    const westDiamonds = [];
    const westClubs = [];
		const west = new Player(Direction.WEST);
    west.initWithExplicits(westSpades, westHearts, westDiamonds, westClubs);
    westSpades[0] = "3";
    expect(west.hasUnplayedCard(Card.getFromValues("2", Spades))).toBe(true);
    expect(west.hasUnplayedCard(Card.getFromValues("3", Spades))).toBe(false);
    expect(west.hasUnplayedCard(Card.getFromValues("5", Spades))).toBe(false);
  });

  it("legal moves with matching color", () => {
		const westSpades = [ "2", "3", "A" ];
		const westHearts = [ "J", "Q" ];
		const westDiamonds = [];
		const westClubs = [ "10", "K" ];
		const west = new Player(Direction.WEST);
		west.initWithExplicits(westSpades, westHearts, westDiamonds, westClubs);
		const trick = new Trick(NoTrump);
		trick.addCard(Three.of(Hearts), dummyPlayer);
		trick.addCard(Ace.of(Clubs), dummyPlayer);
    const moves = west.getPossibleMoves(trick);
    expect(moves.length).toBe(2);
    expect(moves[0]).toBe(Jack.of(Hearts));
    expect(moves[1]).toBe(Queen.of(Hearts));
  });

  it("legal moves with no matching color", () => {
		const westSpades = [ "2", "3", "A" ];
		const westHearts = [ "J", "Q" ];
		const westDiamonds = [];
		const westClubs = [ "10", "K" ];
		const west = new Player(Direction.WEST);
		west.initWithExplicits(westSpades, westHearts, westDiamonds, westClubs);
		const trick = new Trick(NoTrump);
		trick.addCard(Three.of(Diamonds), dummyPlayer);
		trick.addCard(Ace.of(Clubs), dummyPlayer);
    const moves = west.getPossibleMoves(trick);
    expect(moves.length).toBe(7);
    expect(moves).toContain(Two.of(Spades));
    expect(moves).toContain(Three.of(Spades));
    expect(moves).toContain(Ace.of(Spades));
    expect(moves).toContain(Jack.of(Hearts));
    expect(moves).toContain(Queen.of(Hearts));
    expect(moves).toContain(Ten.of(Clubs));
    expect(moves).toContain(King.of(Clubs));
  });

  it("legal moves with first play", () => {
		const westSpades = [ "2", "3", "A" ];
		const westHearts = [ "J", "Q" ];
		const westDiamonds = [];
		const westClubs = [ "10", "K" ];
		const west = new Player(Direction.WEST);
		west.initWithExplicits(westSpades, westHearts, westDiamonds, westClubs);
		const trick = new Trick(Clubs);
		trick.addCard(Three.of(Diamonds), dummyPlayer);
		trick.addCard(Ace.of(Clubs), dummyPlayer);
    const moves = west.getPossibleMoves(trick);
    expect(moves.length).toBe(7);
    expect(moves).toContain(Two.of(Spades));
    expect(moves).toContain(Three.of(Spades));
    expect(moves).toContain(Ace.of(Spades));
    expect(moves).toContain(Jack.of(Hearts));
    expect(moves).toContain(Queen.of(Hearts));
    expect(moves).toContain(Ten.of(Clubs));
    expect(moves).toContain(King.of(Clubs));
  });

  it("play third move", () => {
		const westSpades = [ "2", "3", "A" ];
		const westHearts = [ "J", "Q" ];
		const westDiamonds = [];
		const westClubs = [ "10", "K" ];
		const west = new Player(Direction.WEST);
		west.initWithExplicits(westSpades, westHearts, westDiamonds, westClubs);
		const trick = new Trick(Clubs);
		trick.addCard(Three.of(Diamonds), dummyPlayer);
		trick.addCard(Ace.of(Clubs), dummyPlayer);
    const moves = west.getPossibleMoves(trick);
    expect(moves.length).toBe(7);
    west.play(trick, 3);
    expect(moves[3].toString()).toBe('Q of HEARTS');
    expect(moves.length).toBe(7);
		expect(west.hasPlayedCard(moves[3])).toBe(true);
		expect(west.hasUnplayedCard(moves[3])).toBe(false);
  });
});
