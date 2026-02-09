import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export class UIStore {
    rootStore: RootStore;
    topLoading: boolean = false;
    baseLoading: boolean = false;
    chairLoading: boolean = false;

    takeScreenshot = false;
    canvasScreenshot: string | null = null;
    screenshotReady = false;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);
    }

    setTopLoading(val: boolean) {
        this.topLoading = val;
    }

    setBaseLoading(val: boolean) {
        this.baseLoading = val;
    }

    setChairLoading(val: boolean) {
        this.chairLoading = val;
    }

    requestScreenshot() {
        this.screenshotReady = false;
        this.takeScreenshot = true;
    }

    setScreenshot(dataUrl: string) {
        this.canvasScreenshot = dataUrl;
        this.screenshotReady = true;
    }

    resetScreenshotTrigger() {
        this.takeScreenshot = false;
    }

    resetScreenshot() {
  this.takeScreenshot = false;
  this.screenshotReady = false;
  this.canvasScreenshot = null;
}


    get isCanvasLoading() {
        return this.topLoading || this.baseLoading || this.chairLoading;
    }
}
