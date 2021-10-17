import { SearchNode } from "./SearchNode";

export interface PruningStrategy {
  prune(node: SearchNode): void;
}
