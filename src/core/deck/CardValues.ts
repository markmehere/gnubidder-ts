import { Card } from "../Card";
import { Suit } from "./Suit";

const secret = "shouldnotconstructotherthanCardValues.ts";

export class Ace {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("A", denomination, secret);
    }
    return this.instances[denomination.index];
  }
  public static isValueOf(card: Card): boolean {
    return card.value == Card.strToIntValue("A");
  }
}

export class King {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("K", denomination, secret);
    }
    return this.instances[denomination.index];
  }
  public static isValueOf(card: Card): boolean {
    return card.value == Card.strToIntValue("K");
  }
}

export class Queen {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("Q", denomination, secret);
    }
    return this.instances[denomination.index];
  }
  public static isValueOf(card: Card): boolean {
    return card.value == Card.strToIntValue("Q");
  }
}

export class Jack {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("J", denomination, secret);
    }
    return this.instances[denomination.index];
  }
  public static isValueOf(card: Card): boolean {
    return card.value == Card.strToIntValue("J");
  }
}

export class Ten {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("10", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Nine {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("9", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Eight {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("8", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Seven {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("7", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Six {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] =  new Card("6", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}
export class Five {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("5", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Four {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("4", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Three {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("3", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}

export class Two {
  private static instances = [];
  public static of(denomination: Suit): Card {
    if (!this.instances[denomination.index]) {
      this.instances[denomination.index] = new Card("2", denomination, secret);
    }
    return this.instances[denomination.index];
  }
}
