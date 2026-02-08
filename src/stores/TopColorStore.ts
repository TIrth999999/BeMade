import { makeAutoObservable } from "mobx";
import topColors from "../data/topColors.json";
import { RootStore } from "./RootStore";
import type { TopColor } from "../types";

export class TopColorStore {
  root: RootStore;
  colors: TopColor[] = topColors;
  selectedColorId: string = topColors[0].id;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);
  }

  setColor(id: string) {
    this.selectedColorId = id;
  }

  get selectedColor() {
    return this.colors.find(c => c.id === this.selectedColorId)!;
  }

  get selectedTopColor() {
    return this.colors.find(c => c.id === this.selectedColorId)!;
  }
}