import { ApiContract, ApiRules } from "../../api/interfaces";
import { Card } from "../Card";
import { Deal } from "../Deal";
import { Player, PlayerPair } from "../Player";
import { PositionLookup } from "./PositionLookup";
import { PruningStrategy } from "./PruningStrategy";
import { applyRuleFilters } from "./RuleFilters";
import { SearchNode } from "./SearchNode";
import { DefaultSolverConfigurator, SolverConfigurator } from "./SolverConfigurator";

export class DoubleDummySolver {
  private root: SearchNode;
  private stack: SearchNode[];
  private game: Deal;
  private finalMoves: number[];
  private positionsCount: number;
  private runningTime: number;
  private maxTricks: number;
  private rules: ApiRules;
  private contract?: ApiContract;
  public useDuplicateRemoval = true;
  private shouldPruneCardsInSequence = true;
  public lookup: PositionLookup;
  private terminateIfRootOnlyHasOneValidMove = true;
  private postEvaluationPruningStrategies: PruningStrategy[] = [];
  private configurator: SolverConfigurator = null;

  public setTerminateIfRootOnlyHasOneValidMove(terminateIfRootOnlyHasOneValidMove: boolean) {
    this.terminateIfRootOnlyHasOneValidMove = terminateIfRootOnlyHasOneValidMove;
  }

  constructor(game: Deal, root: SearchNode, rules: ApiRules = {}, contract: ApiContract = undefined) {
    const configurator: SolverConfigurator = DefaultSolverConfigurator;

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
      this.lookup = new PositionLookup();
      configurator.configure(this);
    }
  }

  public addPostEvaluationPruningStrategy(strategy: PruningStrategy) {
    this.postEvaluationPruningStrategies.push(strategy);
  }

  public search(maxSearch?: number) {
    const start = Date.now();
    this.runningTime = 0;
    this.positionsCount = 0;
    this.root = new SearchNode(null);
    this.root.rules = this.rules || {};
    this.stack.push(this.root);
    if (!maxSearch) maxSearch = Math.max(0, this.rules.maxSearch) || 150000;
    while (this.stack.length !== 0 && this.positionsCount < maxSearch) {
      const node: SearchNode = this.stack.pop();
      this.examinePosition(node);
      this.positionsCount++;
    }
    this.runningTime = Date.now() - start;
  }

  public setUseDuplicateRemoval(b: boolean) {
    this.useDuplicateRemoval = b;
  }

  public setShouldPruneCardsInSequence(b: boolean) {
    this.shouldPruneCardsInSequence = b;
  }

  public getPositionsExamined(): number {
    return this.positionsCount;
  }

  public examinePosition(node: SearchNode) {
    if (node.isPruned()) return;
    const position: Deal = this.game.duplicate();
    position.playMoves(node.getMoves());
    const player: Player = position.getNextToPlay();
    node.setPlayerTurn(player.getDirection());
    node.setPosition(position);
    if (position.oneTrickLeft()) {
      position.playMoves(this.finalMoves);
    }
    const moves = player.getPossibleMoves(position.currentTrick);
    applyRuleFilters(moves, position, player, this.rules, this.contract).forEach((card: Card) => {
      this.makeChildNodeForCardPlayed(node, player, card);
    });
    this.checkDuplicatePositions(node, position);
    if (position.getTricksPlayedSinceSearchStart() >= this.maxTricks || position.isDone() || node.hasIdenticalTwin()) {
      node.setLeaf(true);
      this.trim(node);
    } else {
      node.children.forEach((move: SearchNode) => this.shouldPruneCardsInSequence &&
        this.removeSiblingsInSequence(move));
      if (!this.rootOnlyHasOneValidMove(node) || !this.terminateIfRootOnlyHasOneValidMove) {
        node.children.forEach((move: SearchNode) => this.stack.push(move));
      }
    }
  }

  private rootOnlyHasOneValidMove(node: SearchNode): boolean {
    if (node == this.root && node.getUnprunedChildCount() == 1) {
      return true;
    } else {
      return false;
    }
  }

  private checkDuplicatePositions(node: SearchNode, position: Deal) {
    if (this.rules.disableDuplicateRemoval) return false;
    if (this.useDuplicateRemoval) {
      if (this.lookup.positionEncountered(position, node.tricksTaken)) {
        const previouslyEncounteredNode: number[] = this.lookup.getNode(position);
        node.setIdenticalTwin(previouslyEncounteredNode);
      }
    }
  }

  private makeChildNodeForCardPlayed(parent: SearchNode, player: Player, card: Card) {
    const move: SearchNode = new SearchNode(parent);
    move.rules = this.rules || {};
    move.cardPlayed = card;
    move.setPlayerCardPlayed(player);
  }

  private removeSiblingsInSequence(move: SearchNode) {
    const cardsInSuit: Card[] = move.getSiblingsInColor();
    const shouldTrim = !!cardsInSuit.find((sibling: Card) => (sibling.value - move.cardPlayed.value) === 1);
    if (shouldTrim) {
      move.pruneAsSequenceSibling();
    }
  }

  public trim(node: SearchNode) {
    if (this.root == node) {
      node.nullAllSubstandardChildren();
    } else {
      node.nullAllChildrenExceptOne();
    }
    node.calculateValue();
    this.postEvaluationPruningStrategies.forEach((pruningStrategy: PruningStrategy) => {
      pruningStrategy.prune(node);
    });
    if (node.canTrim()) {
      this.trim(node.parent);
    }
    node.trimmed = true;
  }

  public getBestMoves(): Card[] {
    const result: Card[] = [];
    const cardPlayed = this.root.getBestMove().cardPlayed;
    if (this.rules.printDebug) {
      const toReadable = [ 'W', 'N', 'E', 'S' ];
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

  public printStats() {
    let pruneType = "Unpruned";
    if (this.postEvaluationPruningStrategies.length > 0) {
      pruneType = "Pruned";
    }
    console.log(pruneType + " search took (msec): " + this.runningTime);
    console.log("  Positions examined: " + this.getPositionsExamined());
    console.log("West/East tricks taken: " + this.root.getTricksTaken(PlayerPair.WEST_EAST));
    console.log("North/South tricks taken: " + this.root.getTricksTaken(PlayerPair.NORTH_SOUTH));
  }

  public getConfigurator(): SolverConfigurator {
    return this.configurator;
  }

  public setMaxTricks(i: number) {
    this.maxTricks = i;
  }

  public getStack(): SearchNode[] {
    return this.stack;
  }

  public getRoot(): SearchNode {
    return this.root;
  }
}
