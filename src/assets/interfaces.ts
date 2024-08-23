export interface Item {
  id: number;
  name: string;
}

export interface ItemList {
  criteria: Item[];
  options: Item[];
}

export interface Consistency {
  item: Item;
  consistency: number;
}

export interface Result {
  item: Item;
  result: number;
}
