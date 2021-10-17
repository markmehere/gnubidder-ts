import { NoTrump } from "../deck/NoTrump";
import { Hearts, Spades, Clubs, Diamonds } from "../deck/SuitValues";
import { Bid } from "./Bid";
import { Vulnerability } from "./Vulnerability";


export class ScoreCalculator {
  private static INSULT_BONUS = 50;
  private defenderPoints: number;
  private declarerPoints: number;
  private highBid: Bid;
  private tricksTakenByDeclarers: number;
  private vulnerability: Vulnerability;

  constructor(highBid: Bid, tricksTakenByDeclarers: number, vulnerability: Vulnerability) {
    this.highBid = highBid;
    this.tricksTakenByDeclarers = tricksTakenByDeclarers;
    this.vulnerability = vulnerability;
    this.calculateScore();
  }

  private calculateScore() {
    const bidValue: number = this.highBid.value;
    const numberTricksNeededByDeclarer: number = bidValue + 6;
    this.declarerPoints = 0;
    this.defenderPoints = 0;
    if (this.tricksTakenByDeclarers >= numberTricksNeededByDeclarer) {
      let pointsPerTrick = 30;
      let contractWorth = 0;

      if (this.highBid.trump === Hearts || this.highBid.trump === Spades) {
        pointsPerTrick = 30;
      } else if (this.highBid.trump === Clubs || this.highBid.trump === Diamonds) {
        pointsPerTrick = 20;
      } else if (this.highBid.trump === NoTrump) {
        pointsPerTrick = 30;
        contractWorth = 10;
      } else {
        throw new Error("Unknown trump: " + this.highBid.trump);
      }

      if (this.highBid.isRedoubled()) {
        contractWorth *= 4 + ScoreCalculator.INSULT_BONUS * 2;
        pointsPerTrick *= 4;
      }
      else if (this.highBid.isDoubled()) {
        contractWorth *= 2 + ScoreCalculator.INSULT_BONUS;
        pointsPerTrick *= 2;
      }

      contractWorth += bidValue * pointsPerTrick;
      const numOverTricks: number = this.tricksTakenByDeclarers - numberTricksNeededByDeclarer;
      if (numberTricksNeededByDeclarer == 13) {
        if (this.vulnerability.isDeclarerVulnerable()) {
          this.declarerPoints = 1500;
        } else {
          this.declarerPoints = 1000;
        }
      } else if (numberTricksNeededByDeclarer == 12) {
        if (this.vulnerability.isDeclarerVulnerable()) {
          this.declarerPoints = 750;
        } else {
          this.declarerPoints = 500;
        }
      } else if (contractWorth >= 100) {
        if (this.vulnerability.isDeclarerVulnerable()) {
          this.declarerPoints = 500;
        } else {
          this.declarerPoints = 300;
        }
      } else {
        this.declarerPoints = 50;
      }

      if (this.highBid.isRedoubled()) {
        if (this.vulnerability.isDeclarerVulnerable()) {
          pointsPerTrick = 400;
        } else {
          pointsPerTrick = 200;
        }
      }
      else if (this.highBid.isDoubled()) {
        if (this.vulnerability.isDeclarerVulnerable()) {
          pointsPerTrick = 200;
        } else {
          pointsPerTrick = 100;
        }
      }
      this.declarerPoints += contractWorth + numOverTricks * pointsPerTrick;
    } else {
      const underTricks: number = numberTricksNeededByDeclarer - this.tricksTakenByDeclarers;
      if (this.vulnerability.isDeclarerVulnerable()) {
        if (this.highBid.isRedoubled()) {
          this.defenderPoints += 400 + (underTricks - 1) * 600;
        }
        else if (this.highBid.isDoubled()) {
          this.defenderPoints += 200 + (underTricks - 1) * 300;
        }
        else {
          this.defenderPoints += underTricks * 100;
        }
      } else {
        if (this.highBid.isRedoubled()) {
          if (underTricks === 1) {
            this.defenderPoints += 200;
          }
          else if (underTricks === 2) {
            this.defenderPoints += 600;
          }
          else if (underTricks === 3) {
            this.defenderPoints += 1000;
          }
          else if (underTricks > 3) {
            this.defenderPoints = 1000 + (underTricks - 3) * 300;
          }
        }
        else if (this.highBid.isDoubled()) {
          if (underTricks === 1) {
            this.defenderPoints += 100;
          }
          else if (underTricks === 2) {
            this.defenderPoints += 300;
          }
          else if (underTricks === 3) {
            this.defenderPoints += 500;
          }
          else if (underTricks > 3) {
            this.defenderPoints = 500 + (underTricks - 3) * 300;
          }
        } else {
          this.defenderPoints += underTricks * 50;
        }
      }
    }
  }

  public getDeclarerScore(): number {
    return this.declarerPoints;
  }

  public getDefenderScore(): number {
    return this.defenderPoints;
  }
}
