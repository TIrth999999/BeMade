import baseShapes from "../data/baseShapes.json"
import { makeAutoObservable, reaction } from "mobx"
import { RootStore } from "./RootStore";
import type { BaseShape } from "../types";

export class BaseStore {
  root: RootStore;
  baseShapes: BaseShape[] = baseShapes;
  selectedBaseId: string = baseShapes[0].id;

  constructor(root: RootStore) {
    this.root = root;

    makeAutoObservable(this);
    reaction(
      () => this.selectedBaseId,
      () => {
        const availableTopShapes = this.availableTopShapes;
        const selectedTopId = this.root.topShapeStore.selectedTopShapeId;

        const isValid = availableTopShapes.some(
          shape => shape.id === selectedTopId
        );
        if (!isValid && availableTopShapes.length > 0) {
          this.root.topShapeStore.setTopShape(availableTopShapes[0].id);
        }
      }
    );


  }

  setBase(id: string) {
    this.selectedBaseId = id
  }

  get selectedBase() {
    return this.baseShapes.find((b: { id: any }) => b.id === this.selectedBaseId)!
  }

  get availableColors() {
    return this.root.colorStore.colors.filter((c: { id: any }) =>
      this.selectedBase.colorIds.includes(c.id)
    )
  }

  get selectedBaseColor() {
    let color = this.availableColors.find(
      c => c.id === this.root.colorStore.selectedColorId
    );

    if (!color) {
      color = this.availableColors[0];
      this.root.colorStore.setColor(color.id);
    }

    return color;
  }


  get availableTopShapes() {
    return this.root.topShapeStore.topShapes.filter((t: { id: any }) =>
      this.selectedBase.topShapeIds.includes(t.id)
    )
  }
}
