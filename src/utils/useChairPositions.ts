import { useStore } from "../context/StoreContext";
import { useMemo } from "react";

type ChairTransform = {
    position: [number, number, number];
    rotation: [number, number, number];
};

export const useChairPositions = (): ChairTransform[] => {
    const { chairStore, dimensionsStore, topShapeStore } = useStore();

    const count = chairStore.count;

    const length = dimensionsStore.length;
    const width = dimensionsStore.width;
    const shapeId = topShapeStore.selectedTopShape.id;

    const chairOffset = 0.45;

    const positions = useMemo(() => {
        const transforms: ChairTransform[] = [];
        if (count === 0) return transforms;

        type SeatDistribution = {
            longSide: number;
            shortSide: number;
        };

        const resolveSeatDistribution = (total: number): SeatDistribution => {
            if (total === 0) return { longSide: 0, shortSide: 0 };
            if (total <= 2) return { longSide: 1, shortSide: 0 };
            if (total <= 4) return { longSide: 1, shortSide: 1 };
            if (total <= 6) return { longSide: 2, shortSide: 1 };
            if (total <= 8) return { longSide: 3, shortSide: 1 };
            if (total <= 10) return { longSide: 4, shortSide: 1 };
            return { longSide: 5, shortSide: 1 };
        };

        const computeCircleChairs = () => {

            const radius = (width / 2000) + chairOffset;
            const step = (Math.PI * 2) / count;

            for (let i = 0; i < count; i++) {
                const angle = i * step;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                transforms.push({
                    position: [x, 0, z],
                    rotation: [0, -angle - Math.PI / 2, 0],
                });
            }
        };

        const computeOvalChairs = () => {
            const a = (length / 2000) + chairOffset;
            const b = (width / 2000) + chairOffset;

            const step = (Math.PI * 2) / count;

            for (let i = 0; i < count; i++) {
                const angle = (i * step) - (Math.PI / 2);

                const x = Math.cos(angle) * a;
                const z = Math.sin(angle) * b;

                const nx = x / (a * a);
                const nz = z / (b * b);

                const rotationY = Math.atan2(nx, nz) + Math.PI;

                transforms.push({
                    position: [x, 0, z],
                    rotation: [0, rotationY, 0],
                });
            }
        };

        const computeRectangleLikeChairs = () => {
            const { longSide, shortSide } = resolveSeatDistribution(count);

            const halfX = length / 2000;
            const halfZ = width / 2000;
            const o = chairOffset;

            const segmentWidth = (halfX * 2) / longSide;

            // 1. Top Side (Negative Z)
            for (let i = 0; i < longSide; i++) {
                const x = -halfX + (segmentWidth * i) + (segmentWidth / 2);
                transforms.push({
                    position: [x, 0, -halfZ - o],
                    rotation: [0, 0, 0],
                });
            }

            // 2. Bottom Side (Positive Z)
            for (let i = 0; i < longSide; i++) {
                const x = -halfX + (segmentWidth * i) + (segmentWidth / 2);
                transforms.push({
                    position: [x, 0, halfZ + o],
                    rotation: [0, Math.PI, 0],
                });
            }

            // 3. Short sides (Heads)
            if (shortSide === 1) {
                transforms.push({
                    position: [halfX + o, 0, 0],
                    rotation: [0, -Math.PI / 2, 0],
                });

                transforms.push({
                    position: [-halfX - o, 0, 0],
                    rotation: [0, Math.PI / 2, 0],
                });
            }
        };

        const distributeSquareChairs = (total: number) => {

            const base = Math.floor(total / 4);
            const remainder = total % 4;

            const counts = [base, base, base, base];

            if (remainder >= 1) counts[0]++;
            if (remainder >= 2) counts[1]++;
            if (remainder >= 3) counts[2]++;

            return counts;
        };

        const computeSquareChairs = () => {
            const half = length / 2000;
            const o = chairOffset;

            const [topCount, bottomCount, rightCount, leftCount] = distributeSquareChairs(count);

            if (topCount > 0) {
                const seg = (half * 2) / topCount;
                for (let i = 0; i < topCount; i++) {
                    const x = -half + (seg * i) + (seg / 2);
                    transforms.push({
                        position: [x, 0, -half - o],
                        rotation: [0, 0, 0],
                    });
                }
            }

            if (bottomCount > 0) {
                const seg = (half * 2) / bottomCount;
                for (let i = 0; i < bottomCount; i++) {

                    const x = -half + (seg * i) + (seg / 2);
                    transforms.push({
                        position: [x, 0, half + o],
                        rotation: [0, Math.PI, 0],
                    });
                }
            }

            if (rightCount > 0) {
                const seg = (half * 2) / rightCount;
                for (let i = 0; i < rightCount; i++) {
                    const z = -half + (seg * i) + (seg / 2);
                    transforms.push({
                        position: [half + o, 0, z],
                        rotation: [0, -Math.PI / 2, 0],
                    });
                }
            }

            if (leftCount > 0) {
                const seg = (half * 2) / leftCount;
                for (let i = 0; i < leftCount; i++) {
                    const z = -half + (seg * i) + (seg / 2);
                    transforms.push({
                        position: [-half - o, 0, z],
                        rotation: [0, Math.PI / 2, 0],
                    });
                }
            }
        };

        switch (shapeId) {
            case "rectangle":
            case "oblong":
            case "capsule":
                computeRectangleLikeChairs();
                break;
            case "oval":
                computeOvalChairs();
                break;
            case "round":
            case "roundCircle":
                computeCircleChairs();
                break;
            case "square":
                computeSquareChairs();
                break;
            default:
                break;
        }

        return transforms;

    }, [count, length, width, shapeId]);

    return positions;
};
