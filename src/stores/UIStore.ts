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

    isFullscreen: boolean = false;
    isShareModalOpen: boolean = false;
    isMobile: boolean = window.matchMedia("(max-width: 1024px)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    isLoggedIn: boolean = localStorage.getItem("isLoggedIn") === "true";

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeAutoObservable(this);

        window.addEventListener("resize", this.handleResize);
    }

    handleResize = () => {
        this.isMobile = window.matchMedia("(max-width: 1024px)").matches || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };

    setLoggedIn(val: boolean) {
        this.isLoggedIn = val;
        localStorage.setItem("isLoggedIn", val.toString());
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

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
    }

    setShareModalOpen(val: boolean) {
        this.isShareModalOpen = val;
    }


    get isCanvasLoading() {
        return this.topLoading || this.baseLoading || this.chairLoading;
    }
}
