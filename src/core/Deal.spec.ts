import { Card } from "./Card";
import { Deal } from "./Deal";
import { Queen, Ten, Jack, Two, Ace } from "./deck/CardValues";
import { NoTrump } from "./deck/NoTrump";
import { Spades, Diamonds, Hearts, Clubs } from "./deck/SuitValues";

import { Direction, DirectionCollection } from "./Direction";
import { GameUtils } from "./GameUtils";
import { Hand } from "./Hand";
import { Trick } from "./Trick";

describe("core.Deal", () => {

	let game: Deal;

	function playTrick(g: Deal) {
		for (let i = 0; i < 4; i++) {
			g.doNextCard();
		}
	}

	function playMove(game: Deal, moves: number[], cards: Card[], i: number) {
		const player = game.getNextToPlay();
		const card = player.getPossibleMoves(game.currentTrick)[i];
		game.playMoves([ i ]);
		moves.push(i);
		cards.push(card);
	}
	
	beforeEach(() => {
		game = new Deal(NoTrump);
	});

	it("check card equality", () => {
		expect(Spades).toBe(Spades);
		expect(DirectionCollection.WEST_INSTANCE).toBe(DirectionCollection.WEST_INSTANCE);
		expect(Queen.of(Diamonds)).toBe(Queen.of(Diamonds));
		expect(
			(new Hand([Queen.of(Diamonds), Ten.of(Hearts),
				Jack.of(Diamonds), Ten.of(Spades)]))
				.contains(Ten.of(Spades))).toBe(true);
		expect(
			(new Hand([Queen.of(Diamonds), Ten.of(Hearts),
				Jack.of(Diamonds), Ten.of(Spades)]))
				.contains(Jack.of(Spades))).toBe(false);
	});
  
  it("creates players", () => {
    game.players.forEach((player, i) => {
      expect(player).toBeTruthy();
      expect(player.getDirection()).toBe(i);
    });
  });

  it("first trick played clockwise", () => {
		GameUtils.initializeSingleColorSuits(game);
		game.doNextCard();
		expect(game.getPlayer(Direction.WEST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.NORTH).getUnplayedCardsCount()).toBe(13);
		expect(game.getPlayer(Direction.EAST).getUnplayedCardsCount()).toBe(13);
		expect(game.getPlayer(Direction.SOUTH).getUnplayedCardsCount()).toBe(13);
		game.doNextCard();
		expect(game.getPlayer(Direction.WEST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.NORTH).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.EAST).getUnplayedCardsCount()).toBe(13);
		expect(game.getPlayer(Direction.SOUTH).getUnplayedCardsCount()).toBe(13);
		game.doNextCard();
		expect(game.getPlayer(Direction.WEST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.NORTH).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.EAST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.SOUTH).getUnplayedCardsCount()).toBe(13);
		game.doNextCard();
		expect(game.getPlayer(Direction.WEST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.NORTH).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.EAST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.SOUTH).getUnplayedCardsCount()).toBe(12);
		game.doNextCard();
		expect(game.getPlayer(Direction.WEST).getUnplayedCardsCount()).toBe(11);
		expect(game.getPlayer(Direction.NORTH).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.EAST).getUnplayedCardsCount()).toBe(12);
		expect(game.getPlayer(Direction.SOUTH).getUnplayedCardsCount()).toBe(12);
	});
	
	it("game ends when players run out of cards", () => {
		game.getPlayer(Direction.WEST).initWithCards([ Two.of(Spades) ]);
		game.getPlayer(Direction.NORTH).initWithCards([ Two.of(Hearts) ]);
		game.getPlayer(Direction.SOUTH).initWithCards([ Two.of(Diamonds) ]);
		game.getPlayer(Direction.EAST).initWithCards([ Two.of(Clubs) ]);
		for (let i = 0; i < 4; i++) {
			expect(game.isDone()).toBe(false);
			game.doNextCard();
		}
		expect(game.isDone()).toBe(true);
	});

	it("game ends wihen 52 cards played", () => {
		GameUtils.initializeSingleColorSuits(game);
		let cardCount = 0;
		while (!game.isDone()) {
			expect(cardCount).toBeLessThan(52);
			game.doNextCard();
			cardCount++;
		}
		expect(cardCount).toBe(52);
	});

	it("previous trick taker first to play", () => {
		game.getPlayer(Direction.WEST).initWithCards([ Ace.of(Hearts), Two.of(Spades) ]);
		game.getPlayer(Direction.NORTH).initWithCards([ Ace.of(Diamonds), Two.of(Hearts) ]);
		game.getPlayer(Direction.SOUTH).initWithCards([ Two.of(Diamonds), Ace.of(Spades) ]);
		game.getPlayer(Direction.EAST).initWithCards([ Ace.of(Clubs), Two.of(Clubs) ]);
		expect(game.getNextToPlay().toString()).toBe("West");
		expect(game.getPlayer(Direction.WEST)).toBe(game.getNextToPlay());
		playTrick(game);
		expect(game.getNextToPlay().toString()).toBe("South");
		expect(game.getPlayer(Direction.SOUTH)).toBe(game.getNextToPlay());
	});

	it("game keeps track of tricks taken", () => {
		game.getPlayer(Direction.WEST).initWithCards([ Ace.of(Hearts), Two.of(Spades) ]);
		game.getPlayer(Direction.NORTH).initWithCards([ Ace.of(Diamonds), Two.of(Hearts) ]);
		game.getPlayer(Direction.SOUTH).initWithCards([ Two.of(Diamonds), Ace.of(Spades) ]);
		game.getPlayer(Direction.EAST).initWithCards([ Ace.of(Clubs), Two.of(Clubs) ]);
		expect(game.getNextToPlay().toString()).toBe("West");
		expect(game.getPlayer(Direction.WEST)).toBe(game.getNextToPlay());
		playTrick(game);
		expect(game.isDone()).toBe(false);
		playTrick(game);
		expect(game.getPlayer(Direction.WEST).countTricksTaken()).toBe(0);
		expect(game.getPlayer(Direction.NORTH).countTricksTaken()).toBe(1);
		expect(game.getPlayer(Direction.SOUTH).countTricksTaken()).toBe(1);
		expect(game.getPlayer(Direction.EAST).countTricksTaken()).toBe(0);
	});

	it("duplicate reproduces hands", () => {
		const original = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(original);
		const clone = original.duplicate();
		for (let i = Direction.WEST; i <= Direction.SOUTH; i++) {
			const originalHand = original.getPlayer(i).hand;
			const clonedHand = clone.getPlayer(i).hand;
			expect(originalHand).not.toBe(clonedHand);
			expect(originalHand.toString()).toBe(clonedHand.toString());
		}
	});

	it("duplicate cloned does not follow original plays", () => {
		const original = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(original);
		const clone = original.duplicate();
		const originalPlayer = original.getNextToPlay();
		const clonedPlayer = clone.getNextToPlay();
		const card = originalPlayer.getPossibleMoves(new Trick(NoTrump))[12];
		expect(clonedPlayer.hasUnplayedCard(card)).toBe(true);
		expect(originalPlayer.hasUnplayedCard(card)).toBe(true);
		original.doNextCard();
		expect(originalPlayer.hasUnplayedCard(card)).toBe(false);
		expect(clonedPlayer.hasUnplayedCard(card)).toBe(true);
	});

	it("duplicate played cards", () => {
		const original = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(original);
		const originalPlayer = original.getNextToPlay();
		const card = originalPlayer.getPossibleMoves(new Trick(NoTrump))[12];
		original.doNextCard();
		const clone = original.duplicate();
		const clonedPlayer = clone.getPlayer(originalPlayer.getDirection());

		expect(originalPlayer.hasUnplayedCard(card)).toBe(false);
		expect(clonedPlayer.hasUnplayedCard(card)).toBe(false);
		expect(clonedPlayer.hasPlayedCard(card)).toBe(true);
	});

	it("duplicate next to play", () => {
		const original = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(original);
		original.doNextCard();
		const clone = original.duplicate();
		expect(original.nextToPlay).toBe(clone.nextToPlay);
	});

	it("duplicate trump", () => {
		const original = new Deal(NoTrump);
		original.setTrump(Spades);
		const clone = original.duplicate();
		expect(clone.trump).toBe(Spades);
		const original2 = new Deal(NoTrump);
		const clone2 = original2.duplicate();
		expect(clone2.trump).toBe(NoTrump);
	});

	it("duplicate current trick", () => {
		const original = new Deal(Clubs);
		GameUtils.initializeSingleColorSuits(original);
		original.doNextCard();
		const clone = original.duplicate();
		expect(clone.currentTrick).toBeTruthy();
		expect(clone.currentTrick.getHighestCard()).toBe(Ace.of(Spades));
		expect(clone.currentTrick.getTrump()).toBe(Clubs);
	});

	it("duplicate previous trick", () => {
		const original = new Deal(Clubs);
		GameUtils.initializeSingleColorSuits(original);
		original.playOneTrick();
		const clone = original.duplicate();
		expect(clone.getPreviousTrick()).toBeTruthy();
		expect(clone.getPreviousTrick().getHighestCard()).toBe(Two.of(Clubs));
		expect(clone.currentTrick.getTrump()).toBe(Clubs);
	});

	it("plays moves one by one", () => {
		const game = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(game);
		let player = game.getNextToPlay();
		let card = player.getPossibleMoves(game.currentTrick)[3];
		game.playMoves([ 3 ]);
		expect(player.hasPlayedCard(card)).toBe(true);
		player = game.getNextToPlay();
		card = player.getPossibleMoves(game.currentTrick)[2];
		game.playMoves([ 2 ]);
		expect(player.hasPlayedCard(card)).toBe(true);
	});

	it("play moves tricks taken", () => {
		const game = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(game);
		game.playMoves([ 0, 1, 2, 3 ]);
		expect(game.getPlayer(Direction.WEST).countTricksTaken()).toBe(1);
		game.playMoves([ 1, 1, 2, 3, 4, 5, 6, 0, 6 ]);
		expect(game.getPlayer(Direction.WEST).countTricksTaken()).toBe(3);
	});

	it("play moves one by one same as list", () => {
		const original = new Deal(NoTrump);
		GameUtils.initializeSingleColorSuits(original);
		const clone = original.duplicate();

		const moves = [];
		const cards = [];

		playMove(original, moves, cards, 3);
		clone.playMoves(moves);
	
		for (let i = Direction.WEST; i <= Direction.SOUTH; i++) {
			expect(clone.getPlayer(i).hasPlayedCard(cards[i]));
		}
	});

	it("key to weak has map doesn't change", () => {
		GameUtils.initializeSingleColorSuits(game);
		expect(game.getKeyForWeakHashMap()).toBe(game.getKeyForWeakHashMap());
	});

	it("weak hash map same for two different games with same cards", () => {
		const game2 = new Deal(NoTrump);
		const game3 = new Deal(Clubs);
		GameUtils.initializeSingleColorSuits(game);
		GameUtils.initializeSingleColorSuits(game2);
		GameUtils.initializeSingleColorSuits(game3);
		expect(game.getKeyForWeakHashMap()).toBe(game2.getKeyForWeakHashMap());
		expect(game.getKeyForWeakHashMap()).toBe(game3.getKeyForWeakHashMap());
	});

	it("weak hash map different for two different games with same cards but different moves", () => {
		const game2 = new Deal(NoTrump);
		const game3 = new Deal(Clubs);
		GameUtils.initializeSingleColorSuits(game);
		GameUtils.initializeSingleColorSuits(game2);
		GameUtils.initializeSingleColorSuits(game3);
		game2.playOneTrick();
		game3.playOneTrick();
		game3.playOneTrick();
		expect(game.getKeyForWeakHashMap()).not.toBe(game2.getKeyForWeakHashMap());
		expect(game2.getKeyForWeakHashMap()).not.toBe(game3.getKeyForWeakHashMap());
	});
});
