import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
export class DimensionsStore {
  root: RootStore;
  length = 3180;
  width = 1300;

  constructor(root: RootStore) {
    this.root = root;
    
    makeAutoObservable(this);
  }

  setLength(v: number) {
    this.length = v;
  }

  setWidth(v: number) {
    this.width = v;
  }

}
