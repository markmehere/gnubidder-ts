export enum Direction {
  WEST = 0,
  NORTH = 1,
  EAST = 2,
  SOUTH = 3
}

interface DirectionCollectionInterface<T> {
  WEST_INSTANCE: T;
  NORTH_INSTANCE: T;
  EAST_INSTANCE: T;
  SOUTH_INSTANCE: T;
  clockwise: (value: number, amount?: number) => T;
}

export class DirectionInstance {
  private value: Direction;
  private readable: string;
  private collection: DirectionCollectionInterface<DirectionInstance>;

  constructor(value: Direction, readable: string, collection: DirectionCollectionInterface<DirectionInstance>) {
    this.value = value;
    this.readable = readable;
    this.collection = collection;
  }

  public toString(): string {
    return this.readable;
  }

  public getValue(): Direction {
    return this.value;
  }

  public clockwise(): DirectionInstance {
    return this.collection.clockwise(this.value, 1);
  }

  public opposite(): DirectionInstance {
    return this.collection.clockwise(this.value, 2);
  }

  public equals(other: DirectionInstance) {
    return this.value === other.value;
  }
}

export class DirectionCollection {

  public static WEST_INSTANCE: DirectionInstance = new DirectionInstance(Direction.WEST, "West", DirectionCollection);
  public static NORTH_INSTANCE: DirectionInstance = new DirectionInstance(Direction.NORTH, "North", DirectionCollection);
  public static EAST_INSTANCE: DirectionInstance = new DirectionInstance(Direction.EAST, "East", DirectionCollection);
  public static SOUTH_INSTANCE: DirectionInstance = new DirectionInstance(Direction.SOUTH, "South", DirectionCollection);

  public static ORDERED = [ DirectionCollection.WEST_INSTANCE, DirectionCollection.NORTH_INSTANCE, DirectionCollection.EAST_INSTANCE, DirectionCollection.SOUTH_INSTANCE ];

  public static instance(direction: number): DirectionInstance {
    return DirectionCollection.ORDERED[direction] || null;
  }

  public static toUniversalFromDirection(value: Direction) {
    switch (value) {
      case Direction.WEST:
        return 'W';
      case Direction.NORTH:
        return 'N';
      case Direction.EAST:
        return 'E';
      case Direction.SOUTH:
        return 'S';
    }
  }

  public static fromUniversal(value: string): DirectionInstance {
    switch (value) {
      case 'W':
        return this.WEST_INSTANCE;
      case 'N':
        return this.NORTH_INSTANCE;
      case 'E':
        return this.EAST_INSTANCE;
      case 'S':
        return this.SOUTH_INSTANCE;
    }
    throw new Error(`Unable to translate direction: ${value}`);
  }

  public static clockwise(value: number, amount?: number): DirectionInstance {
    return DirectionCollection.ORDERED[(value + amount) % DirectionCollection.ORDERED.length];
  }
}
