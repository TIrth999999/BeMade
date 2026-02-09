import { BaseStore } from "./BaseStore";
import { ColorStore } from "./ColorStore";
import { TopColorStore } from "./TopColorStore";
import { TopShapeStore } from "./TopShapeStore";
import { DimensionsStore } from "./DimensionsStore";
import { ChairStore } from "./ChairStore";
import { UIStore } from "./UIStore";
import { makeAutoObservable } from "mobx";
import { CameraPositionStore } from "./CameraPositionStore";

export class RootStore {
  baseStore: BaseStore;
  colorStore: ColorStore;
  topColorStore: TopColorStore;
  topShapeStore: TopShapeStore;
  dimensionsStore: DimensionsStore;
  chairStore: ChairStore;
  uiStore: UIStore;
  cameraPositionStore: CameraPositionStore;

  constructor() {
    this.baseStore = new BaseStore(this);
    this.colorStore = new ColorStore(this);
    this.topColorStore = new TopColorStore(this);
    this.dimensionsStore = new DimensionsStore(this);
    this.topShapeStore = new TopShapeStore(this);
    this.chairStore = new ChairStore(this);
    this.uiStore = new UIStore(this);
    this.cameraPositionStore = new CameraPositionStore(this);
    makeAutoObservable(this);
  }
}
