import { AlphaBeta } from "./AlphaBeta";
import { DoubleDummySolver } from "./DoubleDummySolver";

export class SolverConfigurator {
  private useAlphaBetaPruning: boolean;

  public isUseAlphaBetaPruning(): boolean {
    return this.useAlphaBetaPruning;
  }

  public setUseAlphaBetaPruning(useAlphaBetaPruning: boolean) {
    this.useAlphaBetaPruning = useAlphaBetaPruning;
  }

  public configure(doubleDummySolver: DoubleDummySolver) {
    if (this.isUseAlphaBetaPruning()) {
      doubleDummySolver.addPostEvaluationPruningStrategy(new AlphaBeta());
    }
  }
}

const DefaultSolverConfigurator = new SolverConfigurator();

DefaultSolverConfigurator.setUseAlphaBetaPruning(true);

export { DefaultSolverConfigurator };
