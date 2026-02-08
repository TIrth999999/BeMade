import { makeAutoObservable, reaction } from "mobx";
import topShapes from "../data/topShapes.json";
import { RootStore } from "./RootStore";
import type { TopShape } from "../types";

export class TopShapeStore {
  root: RootStore;
  topShapes: TopShape[] = topShapes;
  selectedTopShapeId = topShapes[0].id;

  constructor(root: RootStore) {
    this.root = root;
    makeAutoObservable(this);

    reaction(
      () => this.selectedTopShape,
      shape => {
        if (this.root.dimensionsStore.length < shape.defaultLength) {
          this.root.dimensionsStore.setLength(shape.defaultLength);
        }

        if (this.root.dimensionsStore.width < shape.defaultWidth) {
          this.root.dimensionsStore.setWidth(shape.defaultWidth);
        }

        if (this.root.dimensionsStore.length > shape.defaultLength) {
          this.root.dimensionsStore.setLength(shape.defaultLength);
        }

        if (this.root.dimensionsStore.width > shape.defaultWidth) {
          this.root.dimensionsStore.setWidth(shape.defaultWidth);
        }
      }
    );
  }

  setTopShape(id: string) {
    this.selectedTopShapeId = id;
  }

  get selectedTopShape() {
    return this.topShapes.find(t => t.id === this.selectedTopShapeId)!;
  }

}
