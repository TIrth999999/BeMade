import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export class UIStore {
    rootStore: RootStore;
    topLoading: boolean = false;
    baseLoading: boolean = false;
    chairLoading: boolean = false;

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

    get isCanvasLoading() {
        return this.topLoading || this.baseLoading || this.chairLoading;
    }
}
