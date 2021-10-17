export class HashSet<T> {
  private content: T[] = [];
  
  add(val: T) {
    if (!this.contains(val)) this.content.push(val);
  }

  contains(val: T) {
    return this.content.indexOf(val) > -1;
  }

  forEach(callback: (T, number) => void) {
    this.content.forEach(callback);
  }

  asArray() {
    return this.content;
  }

  size() {
    return this.content.length;
  }
}
