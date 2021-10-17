import { Deal } from "../Deal";

export class ProductionSettings {
  public static DEFAULT_MILISECONDS_TO_DISPLAY_LAST_TRICK = 4000;
  private static milisecondsToDisplayLastTrick: number = ProductionSettings.DEFAULT_MILISECONDS_TO_DISPLAY_LAST_TRICK;
  
  public static setMilisecondsToDisplayLastTrick(value: number): void {
    ProductionSettings.milisecondsToDisplayLastTrick = value;
  }

  public static getSearchDepthRecommendation(game: Deal): number {
    return 13 - game.getTricksPlayedSinceSearchStart();
  }

  public static getMilisecondsToDisplayLastTrick(): number {
    return ProductionSettings.milisecondsToDisplayLastTrick;
  }
}
