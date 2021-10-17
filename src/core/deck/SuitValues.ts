import { Suit } from "./Suit";

class HeartsClass extends Suit {
  public index = 2;

  public isMajorSuit(): boolean {
    return true;
  }

  public toString(): string {
    return "HEARTS";
  }

  public toDebugString(): string {
    return "Hearts.i()";
  }
}

class SpadesClass extends Suit {
  public index = 3;

  public isMajorSuit(): boolean {
    return true;
  }

  public toString(): string {
    return "SPADES";
  }

  public toDebugString(): string {
    return "Spades.i()";
  }
}

export class ClubsClass extends Suit {
  public index = 0;


  public toString(): string {
    return "CLUBS";
  }

  public isMinorSuit(): boolean {
    return true;
  }

  public toDebugString(): string {
    return "Clubs.i()";
  }
}

export class DiamondsClass extends Suit {
  public index = 1;

  public toString(): string {
    return "DIAMONDS";
  }

  public isMinorSuit(): boolean {
    return true;
  }

  public toDebugString(): string {
    return "Diamonds.i()";
  }
}

export const Spades = new SpadesClass();
export const Hearts = new HeartsClass();
export const Clubs = new ClubsClass();
export const Diamonds = new DiamondsClass();
