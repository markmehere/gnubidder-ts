import { Trump } from "./Trump";

export class NoTrumpClass extends Trump {

  public index = -1;

  public toString(): string {
    return "NOTRUMP";
  }

  public toDebugString(): string {
    return "NoTrump.i()";
  }

  public isNoTrump(): boolean {
    return true;
  }

}

export const NoTrump = new NoTrumpClass();
