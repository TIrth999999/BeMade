import { makeAutoObservable } from "mobx";
import baseColors from "../data/baseColors.json";
import { RootStore } from "./RootStore";
import type { BaseColor } from "../types";

export class ColorStore {
  root: RootStore;
  colors: BaseColor[] = baseColors;
  selectedColorId: string = baseColors[0].id;

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
}
