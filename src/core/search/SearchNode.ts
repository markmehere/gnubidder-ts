import { ApiRules } from "../../api/interfaces";
import { Card } from "../Card";
import { Deal } from "../Deal";
import { Player, PlayerPair } from "../Player";
import { Trick } from "../Trick";
import { applyRuleFilters } from "./RuleFilters";

export class SearchNode {
  public static UNINITIALIZED = -1;
  private static ALPHA_UNINIT = -1;
  public static BETA_UNINIT = 14;
  public static PRUNE_ALPHA = 0;
  public static PRUNE_BETA: number = SearchNode.PRUNE_ALPHA + 1;
  public static PRUNE_SEQUENCE_SIBLINGS: number = SearchNode.PRUNE_BETA + 1;
  public static PRUNE_SEQUENCE_SIBLINGS_PLAYED: number = SearchNode.PRUNE_SEQUENCE_SIBLINGS + 1;
  private static PRUNE_DUPLICATE_POSITION: number = SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED + 1;
  public value: number;
  public parent: SearchNode;
  public children: SearchNode[];
  private playerTurn: number;
  public tricksTaken: number[];
  public cardPlayed: Card;
  public trimmed = false;
  public isLeaf = false;
  private pruned = false;
  private pruneType: number = SearchNode.PRUNE_ALPHA - 1;
  private playerCardPlayed: Player;
  private valueSet = false;
  private position: Deal;
  private identicalTwin: number[];
  private alphaAtPruneTime: SearchNode;
  public rules: ApiRules = {};

  constructor(parent: SearchNode, playerTurn?: number) {
    this.parent = parent;
    this.children = [];
    if (parent != null) {
      parent.children.push(this);
    }
    this.tricksTaken = [];
    this.tricksTaken[PlayerPair.WEST_EAST] = SearchNode.UNINITIALIZED;
    this.tricksTaken[PlayerPair.NORTH_SOUTH] = SearchNode.UNINITIALIZED;
    if (playerTurn !== undefined) this.setPlayerTurn(playerTurn);
  }

  private getMyIndex(node: SearchNode): number {
    return this.children.findIndex((x) => x.cardPlayed === node.cardPlayed);
  }

  public printOptimalPath(g: Deal): string {
    const move: SearchNode = this.getBestMove();
    const toReadable = [ 'W', 'N', 'E', 'S' ];
    let result = "";
    const originalDir = toReadable[g.nextToPlay];
    result += `Optimal path for ${originalDir}...\n`
    if (move == this) {
      const moveIdxs = this.getMoves();
      moveIdxs.forEach((moveIdx: number) => {
        const currentTrick: Trick = g.currentTrick;
        const allPossibleMoves = g.getNextToPlay().getPossibleMoves(currentTrick);
        const possibleMoves = applyRuleFilters(allPossibleMoves, g, g.getNextToPlay(), this.rules);
        result += " " + g.getNextToPlay() + ": " + possibleMoves[moveIdx] + ` (${moveIdx}) ${possibleMoves}\n`;
        if (!possibleMoves[moveIdx]) return;
        g.doNextCard(allPossibleMoves.indexOf(possibleMoves[moveIdx]));
        if (currentTrick.isDone()) {
          result += "  Trick taken by " + g.getPlayer(g.getWinnerIndex(currentTrick)) + "\n";
        }
      });
    } else if (move) {
      return move.printOptimalPath(g);
    }
    result += `Optimal path for ${originalDir} concludes\n\n`;
    return result;
  }

  public getMoves(): number[] {
    if (this.parent == null) {
      return [];
    } else {
      const result: number[] = this.parent.getMoves();
      result.push(this.parent.getMyIndex(this));
      return result;
    }
  }

  public setPlayerTurn(direction: number) {
    this.playerTurn = direction;
  }

  public setTricksTaken(pair: number, i: number) {
    this.valueSet = true;
    this.tricksTaken[pair] = i;
  }

  public isLastVisitedChild(child: SearchNode): boolean {
    let hasThisChild = false;
    let overrideWithFalse = false;
    this.children.forEach((sibling: SearchNode) => {
      if (sibling && !overrideWithFalse) {
        if (sibling == child)  {
          hasThisChild = true;
        } else {
          if (!sibling.isLeaf && !sibling.trimmed && !sibling.isPruned()) {
            overrideWithFalse = true;
          }
        }
      }
    });
    if (overrideWithFalse) return false;
    return hasThisChild;
  }

  public getCurrentPair(): number {
    return Player.matchPair(this.getPlayerTurn());
  }

  public getPlayerTurn(): number {
    return this.playerTurn;
  }

  public getTricksTaken(pair: PlayerPair): number {
    return this.tricksTaken[pair];
  }

  public getBestMove(): SearchNode {
    if (this.children.length == 0) {
      return this;
    }
    const max: number = this.getTricksTaken(this.getCurrentPair());
    const childrenWithSameTricksTaken: SearchNode[] = [];
    this.children.forEach((move: SearchNode) => {
      if (move != null && (this.rules.considerPrunedMoves || !move.isPruned()) && move.getTricksTaken(this.getCurrentPair()) == max) {
        childrenWithSameTricksTaken.push(move);
      }
    });
    return this.getNodeWithLowestValueCard(childrenWithSameTricksTaken);
  }

  private getNodeWithLowestValueCard(nodes: SearchNode[]): SearchNode {
    let lowest: SearchNode = null;
    nodes.forEach((node: SearchNode) => {
      if (lowest == null || node.cardPlayed.value < lowest.cardPlayed.value) {
        lowest = node;
      }
    });
    return lowest;
  }

  public printLeafs(): string {
    if (this.isLeaf) {
      return "*********\nNode: [" + this.getMoves().join(", ") + "]\n" + this.printMoves() + "\n";
    } else {
      let result = "";
      this.children.forEach((child: SearchNode) => {
        if (child != null) {
          result += child.printLeafs();
        }
      });
      return result;
    }
  }

  public printMoves(): string {
    if (this.isRoot()) {
      return "";
    } else {
      return this.parent.printMoves() + this.getPlayerCardPlayed() + ": " + this.cardPlayed + (this.isPruned() ? " (pruned " + this.pruneTypeToString() + ")" : "") + "\n";
    }
  }

  private pruneTypeToString(): string {
    let result = "UNKNOWN";
    if (this.pruneType == SearchNode.PRUNE_ALPHA) {
      result = "ALPHA";
    } else if (this.pruneType == SearchNode.PRUNE_BETA) {
      result = "BETA";
    } else if (this.pruneType == SearchNode.PRUNE_DUPLICATE_POSITION) {
      result = "DUPLICATE POSITION";
    } else if (this.pruneType == SearchNode.PRUNE_SEQUENCE_SIBLINGS) {
      result = "SIBLING SEQUENCE";
    } else if (this.pruneType == SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED) {
      result = "SIBLING IN PLAYED SEQUENCE";
    }
    return result;
  }

  private isRoot(): boolean {
    return this.parent == null;
  }

  public setLeaf(b: boolean) {
    this.isLeaf = b;
  }

  private setPruned(b: boolean, type: number) {
    this.pruned = b;
    this.pruneType = type;
  }

  public isPruned(): boolean {
    if (this.parent == null) {
      return this.pruned;
    } else if (this.pruned) {
      return true;
    } else {
      return this.parent.isPruned();
    }
  }

  public isAlpha(): boolean {
    return this.getMaxPlayer() === this.getCurrentPair();
  }

  public getRoot(): SearchNode {
    if (this.parent == null) {
      return this;
    } else {
      return this.parent.getRoot();
    }
  }

  public isAlphaPruned(): boolean {
    return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_ALPHA);
  }

  public isBetaPruned(): boolean {
    return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_BETA);
  }

  public getPruneType(): number {
    if (this.parent == null) {
      return this.pruneType;
    } else if (this.pruned) {
      return this.pruneType;
    } else {
      return this.parent.getPruneType();
    }
  }

  public hasAlphaAncestor(): boolean {
    if (this.parent == null) {
      return false;
    } else if (this.parent.isAlpha()) {
      return true;
    } else {
      return this.parent.hasAlphaAncestor();
    }
  }

  public hasBetaAncestor(): boolean {
    if (this.parent == null) {
      return false;
    } else if (this.parent.isBeta()) {
      return true;
    } else {
      return this.parent.hasBetaAncestor();
    }
  }

  public isBeta(): boolean {
    return !this.isAlpha();
  }

  public betaPrune() {
    if (this.parent != null && !this.parent.isBeta()) {
      this.parent.setTricksTaken(PlayerPair.WEST_EAST, this.getTricksTaken(PlayerPair.WEST_EAST));
      this.parent.setTricksTaken(PlayerPair.NORTH_SOUTH, this.getTricksTaken(PlayerPair.NORTH_SOUTH));
      this.parent.setPruned(true, SearchNode.PRUNE_BETA);
      this.parent.betaPrune();
    }
  }

  public alphaPrune() {
    if (this.parent != null && !this.parent.isAlpha() && !this.parent.parent.isRoot()) {
      this.parent.setTricksTaken(PlayerPair.WEST_EAST, this.getTricksTaken(PlayerPair.WEST_EAST));
      this.parent.setTricksTaken(PlayerPair.NORTH_SOUTH, this.getTricksTaken(PlayerPair.NORTH_SOUTH));
      this.parent.setPruned(true, SearchNode.PRUNE_ALPHA);
      this.alphaAtPruneTime = this.parent.getLocalAlphaNode();
      this.parent.alphaPrune();
    }
  }

  public setPlayerCardPlayed(player: Player) {
    this.playerCardPlayed = player;
  }

  public getPlayerCardPlayed(): Player {
    return this.playerCardPlayed;
  }

  public hasAncestor(ancestor: SearchNode): boolean {
    if (this == ancestor) {
      return true;
    } else if (this.parent == null) {
      return false;
    } else {
      return this.parent.hasAncestor(ancestor);
    }
  }

  public getLocalAlpha(): number {
    const localAlpha: SearchNode = this.getLocalAlphaNode();
    if (localAlpha != null) {
      return this.getLocalAlphaNode().getTricksTaken(this.getMaxPlayer());
    } else {
      return SearchNode.ALPHA_UNINIT;
    }
  }

  private getLocalAlphaNode(): SearchNode {
    if (this.isAlpha()) {
      let max: number = SearchNode.ALPHA_UNINIT;
      let result: SearchNode = null;
      this.children.forEach((child: SearchNode) => {
        if (child.getTricksTaken(this.getMaxPlayer()) > max) {
          max = child.getTricksTaken(this.getMaxPlayer());
          result = child;
        }
      });
      return result;
    } else {
      return this.parent.getLocalAlphaNode();
    }
  }

  private getUniqueId(): string {
    let myIndex = 0;
    if (this.parent != null) {
      myIndex = this.parent.getMyIndex(this);
    }
    return this.getDepth() + "-" + myIndex;
  }

  public getLocalBeta(): number {
    if (this.isBeta()) {
      let min: number = SearchNode.BETA_UNINIT;
      this.children.forEach((child: SearchNode) => {
        if (child.getTricksTaken(this.getMaxPlayer()) != -1 && 
          child.getTricksTaken(this.getMaxPlayer()) < min) {
          min = child.getTricksTaken(this.getMaxPlayer());
        }
      });
      return min;
    } else {
      return this.parent.getLocalBeta();
    }
  }

  private getMaxPlayer(): number {
    return this.getRoot().getCurrentPair();
  }

  public shouldBeAlphaPruned(): boolean {
    return !this.rules.disableAlphaPrune && this.valueSet && this.parent != null &&
      this.parent.parent != null && this.hasAlphaAncestor() && !this.parent.isAlpha() &&
      (this.getTricksTaken(this.getMaxPlayer()) <= this.parent.getLocalAlpha());
  }

  public shouldBeBetaPruned(): boolean {
    return !this.rules.disableBetaPrune && this.valueSet && this.parent != null &&
      this.parent.parent != null && this.hasBetaAncestor() && !this.parent.isBeta() &&
      (this.getTricksTaken(this.getMaxPlayer()) >= this.parent.getLocalBeta());
  }

  public toString(): string {
    return "Node " + this.getMoves().toString() +   
      " / pruning status: " + this.isPruned() + " " + 
      this.pruneTypeToString() + " / " + this.getPlayerCardPlayed() + ": " + this.cardPlayed + 
      " Tricks WE|NS: " + this.tricksTaken[0] + "|" + this.tricksTaken[1];
  }

  private siblings(): SearchNode[] {
    return this.parent.children.filter((child: SearchNode) => child !== this);
  }

  public isSequencePruned(): boolean {
    return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_SEQUENCE_SIBLINGS);
  }

  public getSiblingsInColor(): Card[] {
    const cardsInSuit: Card[] = [];
    this.siblings().forEach((sibling: SearchNode) => {
      if (sibling.cardPlayed.hasSameColorAs(this.cardPlayed)) {
        cardsInSuit.push(sibling.cardPlayed);
      }
    });
    return cardsInSuit;
  }

  public isPlayedSequencePruned(): boolean {
    return this.isPruned() && (this.getPruneType() == SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED);
  }

  public pruneAsDuplicatePosition() {
    this.setPruned(false, SearchNode.PRUNE_DUPLICATE_POSITION);
  }

  public isPrunedDuplicatePosition(): boolean {
    return this.hasIdenticalTwin();
  }

  public toDebugString(): string {
    let result = "";
    result += "Node: " + this.parent.getMyIndex(this) + ", " + this.cardPlayed + "\n";
    result += "pruned? " + this.isPruned() + "\n";
    result += "   alpha/beta: " + this.isAlphaPruned() + "/" + this.isBetaPruned() + "\n";
    result += "   sequence/played sequence: " + this.isSequencePruned() + "/" + this.isPlayedSequencePruned() + "\n";
    return result;
  }

  public printAsTree(): string {
    let result = "";
    result = this.padSpaces(this.getDepth()) + this.getUniqueId() + " " + 
      (this.getPlayerCardPlayed() || "root") + ": " + 
      (this.cardPlayed || "root") + ", max: " + this.getTricksTaken(this.getMaxPlayer()) + ' v ' +  this.getTricksTaken(this.getMaxPlayer() === PlayerPair.NORTH_SOUTH ? PlayerPair.WEST_EAST : PlayerPair.NORTH_SOUTH) + this.getPruned();
    this.children.forEach((child: SearchNode) => {
      if (child != null) {
        result += "\n" + child.printAsTree();
      } else {
        result += "\n NULL";
      }
    });
    return result;
  }

  private getPruned(): string {
    if (this.isAlphaPruned()) {
      let betterMove = "no better move available";
      if (this.alphaAtPruneTime != null) {
        betterMove = this.alphaAtPruneTime.getUniqueId() + ": " + this.alphaAtPruneTime.cardPlayed + " with max " + this.alphaAtPruneTime.getTricksTaken(this.getMaxPlayer());
      }
      return ", alpha pruned (" + betterMove + ")";
    } else if (this.isBetaPruned()) {
      return ", beta pruned";
    }

    return "";
  }

  private padSpaces(depth: number): string {
    let result = "";
    for (let i = 0; i < depth; i++) {
      result += "   ";
    }
    return result;
  }

  private getDepth(): number {
    if (this.parent == null) {
      return 0;
    } else {
      return 1 + this.parent.getDepth();
    }
  }

  // eslint-disable-next-line
  public nullAllChildrenExceptOne() { }

  public getUnprunedChildWithMostTricksForCurrentPair(): SearchNode {
    let maxChild: SearchNode = null;
    this.children.forEach((child: SearchNode) => {
      if (child != null && !child.isPruned() && (maxChild == null || child.getTricksTaken(this.getCurrentPair()) > maxChild.getTricksTaken(this.getCurrentPair()))) {
        maxChild = child;
      }
    });
    return maxChild;
  }

  public calculateValueFromChild() {
    const maxChild: SearchNode = this.getUnprunedChildWithMostTricksForCurrentPair();
    if (maxChild != null) {
      this.setTricksTaken(PlayerPair.WEST_EAST, maxChild.getTricksTaken(PlayerPair.WEST_EAST));
      this.setTricksTaken(PlayerPair.NORTH_SOUTH, maxChild.getTricksTaken(PlayerPair.NORTH_SOUTH));
    }
  }

  public calculateValueFromPosition() {
    this.setTricksTaken(PlayerPair.WEST_EAST, this.position.getDistortedTricksTaken(PlayerPair.WEST_EAST, this.rules));
    this.setTricksTaken(PlayerPair.NORTH_SOUTH, this.position.getDistortedTricksTaken(PlayerPair.NORTH_SOUTH, this.rules));
  }

  public setPosition(position: Deal) {
    this.position = position;
  }

  public calculateValue() {
    if (this.isLeaf) {
      if (this.hasIdenticalTwin()) {
        this.calculateValueFromIdenticalTwin();
      } else {
        this.calculateValueFromPosition();
      }
    } else {
      this.calculateValueFromChild();
    }
  }

  private calculateValueFromIdenticalTwin() {
    this.setTricksTaken(PlayerPair.NORTH_SOUTH, this.identicalTwin[PlayerPair.NORTH_SOUTH]);
    this.setTricksTaken(PlayerPair.WEST_EAST, this.identicalTwin[PlayerPair.WEST_EAST]);
  }

  public hasIdenticalTwin(): boolean {
    return this.identicalTwin != null;
  }

  public canTrim(): boolean {
    return this.parent != null && this.parent.isLastVisitedChild(this);
  }

  public setIdenticalTwin(node: number[]) {
    this.identicalTwin = node;
  }

  public getSiblingNodeForCard(card: Card): SearchNode {
    const result = this.siblings().find(
      (sibling: SearchNode) => sibling.cardPlayed === card
    );
    if (!result) throw new Error("Cannot find appropriate sibling node");
    return result;
  }

  public getUnprunedChildCount(): number {
    return this.children.reduce((acc: number, child: SearchNode) => {
      return acc + (child.isPruned() ? 0 : 1);
    }, 0);
  }

  // eslint-disable-next-line
  public nullAllSubstandardChildren() { }

  public pruneAsSequenceSibling() {
    this.setPruned(true, SearchNode.PRUNE_SEQUENCE_SIBLINGS);
  }

  public pruneAsSequenceSiblingPlayed() {
    this.setPruned(true, SearchNode.PRUNE_SEQUENCE_SIBLINGS_PLAYED);
  }

  public pruneAsAlpha() {
    this.setPruned(true, SearchNode.PRUNE_ALPHA);
  }

  public pruneAsBeta() {
    this.setPruned(true, SearchNode.PRUNE_BETA);
  }

  public getParent(): SearchNode {
    return this.parent;
  }
}
