import { PruningStrategy } from "./PruningStrategy";
import { SearchNode } from "./SearchNode";

export class AlphaBeta implements PruningStrategy {
  
  public prune(node: SearchNode): void {
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
