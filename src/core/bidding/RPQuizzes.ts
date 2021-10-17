
/**
 * adapted from Richard Pavlicek's bridge lessons
 * // http://www.rpbridge.net/ 
 *
 */

import { Ace, Jack, Ten, Six, King, Three, Nine, Eight, Two, Seven, Five, Queen, Four } from "../deck/CardValues";
import { Spades, Hearts, Diamonds, Clubs } from "../deck/SuitValues";
import { Hand } from "../Hand";


export class RPQuizzes {
  public static Basics = {
    Lesson2: {
      hand1: () => {
        return new Hand([
          Ace.of(Spades), Jack.of(Spades), Ten.of(Spades), Six.of(Spades),
          King.of(Hearts), Jack.of(Hearts), Three.of(Hearts),
          Nine.of(Diamonds), Eight.of(Diamonds), Six.of(Diamonds),
          Ace.of(Clubs), King.of(Clubs), Two.of(Clubs)
        ]);
      },
      hand2: () => {
        return new Hand([
          Ace.of(Spades), Jack.of(Spades), Nine.of(Spades), Seven.of(Spades), Five.of(Spades),
          Three.of(Hearts), Two.of(Hearts),
          King.of(Diamonds), Queen.of(Diamonds), Seven.of(Diamonds), Five.of(Diamonds),
          Four.of(Clubs), Two.of(Clubs)
        ]);
      },
      hand3: () => {
        return Hand.fromSuits("A,K,4,3", "K,J,9,2", "6,2", "Q,9,7");
      },
      hand4: () => {
        return Hand.fromSuits("Q,10", "3", "Q,J,8,6,5", "A,K,J,8,2");
      },
      hand5: () => {
        return Hand.fromSuits("K,2", "A,Q,3", "A,8,6,5,3", "K,J,3");
      },
      hand6: () => {
        return Hand.fromSuits("A,J,9,7,5", "K,J,10,7", "A,3", "K,2");
      },
      hand7: () => {
        return Hand.fromSuits("A,K,4,3", "A,K,J,2", "2", "K,9,8,2");
      },
      hand8: () => {
        return Hand.fromSuits("A,K,5,4,3", "2", "A,J,9,7,5,4", "3");
      },
      hand9: () => {
        return Hand.fromSuits("A,K,3", "K,J,8", "A,K,6", "J,10,9,6");
      },
      hand10: () => {
        return Hand.fromSuits("K,9,8,7,6", "A,Q,J,9,5", "10,7,5");
      },
      hand11: () => {
        return Hand.fromSuits("A,Q,8", "J,8,7,6,4", "A,Q", "K,J,6");
      },
      hand12: () => {
        return Hand.fromSuits("A,K,10,2", "J,6,4", "A,Q,8", "9,6,4");
      }
    }
  };

}
