import { makeAutoObservable } from "mobx"
import { runInAction } from "mobx";
import { RootStore } from "./RootStore";
import type { CameraPosition } from "../types";


const data = [
    {
        "name": "frontView",
        "position": [0, 1.1, 3.6],
        "fov": 45
    },
    {
        "name": "leftView",
        "position": [-3.082351622444384, 0.87, 1],
        "fov": 45
    },
    {
        "name": "topView",
        "position": [0, 4.2, 0.01],
        "fov": 50
    },
    {
        "name": "rightView",
        "position": [3.45, 0.9, 1.1],
        "fov": 45
    },
    {
        "name": "twoChairView",
        "position": [0, 0.8, 2.0],
        "fov": 45
    },
    {
        "name": "chairView",
        "position": [3.0, 2.6, 2.6],
        "fov": 42
    },
    {
        "name": "chairTopView",
        "position": [0, 4.0, 0.01],
        "fov": 62
    }
]

export class CameraPositionStore {
    root: RootStore;
    cameraPositions: CameraPosition[] = data as CameraPosition[];
    selectedCameraPositionName: string = "frontView";
    isScreenshotFlow = false;

    constructor(root: RootStore) {
        this.root = root;

        makeAutoObservable(this);
    }

    setCameraPosition(name: string) {
        this.selectedCameraPositionName = name;
    }

    startScreenshotView(name: string) {
        this.isScreenshotFlow = true;
        if (this.selectedCameraPositionName === name) {
            // Already at chairView, trigger screenshot immediately
            if (this.root.uiStore) {
                this.root.uiStore.requestScreenshot();
                this.endScreenshotFlow();
            }
        } else {
            this.selectedCameraPositionName = name;
        }
    }

    endScreenshotFlow() {
        this.isScreenshotFlow = false;
    }

    get selectedCameraPosition() {
        return this.cameraPositions.find((b: { name: string }) => b.name === this.selectedCameraPositionName)!
    }
}
