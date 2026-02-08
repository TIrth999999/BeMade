import chairData from "..//data/chairData.json"
import { makeAutoObservable, reaction } from "mobx"
import { RootStore } from "./RootStore";
import type { Chair } from "../types";

export class ChairStore {
    root: RootStore;
    chairs: Chair[] = chairData;
    selectedChairId: string = this.chairs[0].id;
    selectedColorId: string = this.chairs[0].colors[0].id;
    count: number = 0;

    constructor(root: RootStore) {
        this.root = root;

        makeAutoObservable(this);

        reaction(
            () => ({ max: this.maxChairs, count: this.count }),
            ({ max, count }) => {
                if (count > max) {
                    this.setCount(max);
                }
            }
        );
    }

    setChair(id: string) {
        this.selectedChairId = id
    }

    setChairColor(id: string) {
        this.selectedColorId = id
    }


    setCount(num: number) {
        this.count = num;
    }

    get selectedChair() {
        return this.chairs.find((b: { id: any }) => b.id === this.selectedChairId)!
    }

    get availableColors() {
        return this.selectedChair.colors
    }

    get selectedColor() {
        return this.availableColors.find(
            c => c.id === this.selectedColorId
        ) ?? this.availableColors[0];
    }

    get maxChairs() {
        const shapeId = this.root.topShapeStore.selectedTopShape.id;
        const length = this.root.dimensionsStore.length;
        const width = this.root.dimensionsStore.width;

        if (["round", "roundCircle", "square"].includes(shapeId)) {
            if (width < 1400) {
                return 6;
            }
            return 8;
        }

        if (length < 1800) {
            return 6;
        }
        if (length < 2400) {
            return 8;
        }
        if (length < 3000) {
            return 10;
        }

        return 12;
    }
}
