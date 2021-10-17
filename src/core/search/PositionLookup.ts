import { Deal } from "../Deal";

export class PositionLookup {
  public positions: any = {};
  private lastGameLookedUp: Deal;
  private lastNode: number[];

  public positionEncountered(g: Deal, bs: number[]): boolean {
    if (g.currentTrick.getHighestCard() != null) {
      return false;
    }
    const valueToReturn: number[] = this.getNode(g);
    if (valueToReturn == null) {
      this.putNode(g, bs);
      return false;
    }
    return true;
  }

  public getNode(g: Deal): number[] {
    if (g == this.lastGameLookedUp) {
      return this.lastNode;
    }
    const result: number[] = this.positions[g.getKeyForWeakHashMap()];
    if (result != null) {
      this.lastGameLookedUp = g;
      this.lastNode = result;
    }
    return result;
  }

  private putNode(g: Deal, value: number[]): void {
    this.positions[g.getKeyForWeakHashMap()] = value;
  }
}
