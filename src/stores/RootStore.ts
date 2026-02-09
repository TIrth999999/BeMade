import { BaseStore } from "./BaseStore";
import { ColorStore } from "./ColorStore";
import { TopColorStore } from "./TopColorStore";
import { TopShapeStore } from "./TopShapeStore";
import { DimensionsStore } from "./DimensionsStore";
import { ChairStore } from "./ChairStore";
import { UIStore } from "./UIStore";
import { makeAutoObservable } from "mobx";
import { CameraPositionStore } from "./CameraPositionStore";
import toast from "react-hot-toast";

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

    this.init();
  }

  init() {
    const params = new URLSearchParams(window.location.search);
    const stateParam = params.get("s");
    if (stateParam) {
      try {
        const decoded = JSON.parse(atob(stateParam));
        this.applyState(decoded);
        return;
      } catch (e) {
        console.error("Failed to parse state from URL", e);
      }
    }

    const saved = localStorage.getItem("be-made-config");
    if (saved) {
      try {
        this.applyState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse state from localStorage", e);
      }
    }
  }

  serializeState() {
    return {
      baseId: this.baseStore.selectedBaseId,
      baseColorId: this.colorStore.selectedColorId,
      topShapeId: this.topShapeStore.selectedTopShapeId,
      topColorId: this.topColorStore.selectedColorId,
      chairId: this.chairStore.selectedChairId,
      chairColorId: this.chairStore.selectedColorId,
      chairCount: this.chairStore.count,
      length: this.dimensionsStore.length,
      width: this.dimensionsStore.width,
    };
  }

  applyState(state: any) {
    if (state.baseId) this.baseStore.setBase(state.baseId);
    if (state.baseColorId) this.colorStore.setColor(state.baseColorId);
    if (state.topShapeId) this.topShapeStore.setTopShape(state.topShapeId);
    if (state.topColorId) this.topColorStore.setColor(state.topColorId);
    if (state.chairId) this.chairStore.setChair(state.chairId);
    if (state.chairColorId) this.chairStore.setChairColor(state.chairColorId);
    if (state.chairCount !== undefined) this.chairStore.setCount(state.chairCount);
    if (state.length) this.dimensionsStore.setLength(state.length);
    if (state.width) this.dimensionsStore.setWidth(state.width);
  }

  saveToLocal() {
    const state = this.serializeState();
    localStorage.setItem("be-made-config", JSON.stringify(state));
    toast.success("Configuration Saved!", {
      duration: 3000,
      position: "top-center",
      style: {
        background: "#ffffff",
        color: "#000000",
        borderRadius: "10px",
      },
    });
  }
}
