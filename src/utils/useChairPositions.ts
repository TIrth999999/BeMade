import { useStore } from "../context/StoreContext";
import { useMemo } from "react";

type ChairTransform = {
    position: [number, number, number];
    rotation: [number, number, number];
};

export const useChairPositions = (): ChairTransform[] => {
    const { chairStore, dimensionsStore, topShapeStore } = useStore();

    const count = chairStore.count;
    // Current code divides by 1000 for meters, keeping that consistent.
    // User snippet used `tableTop.length / 2000` for half length (so length/2 / 1000).
    // Our store has length in mm? Let's check existing code.
    // Existing: const length = dimensionsStore.length / 1000;
    // So `length` here is in meters.
    // User snippet: `halfX = tableTop.length / 2000`. If tableTop.length is mm. 
    // effectively `halfX = (length_mm / 1000) / 2` = `length_m / 2`.

    const length = dimensionsStore.length; // in mm
    const width = dimensionsStore.width;   // in mm
    const shapeId = topShapeStore.selectedTopShape.id;

    // Chair offset from user snippet
    const chairOffset = 0.45;

    const positions = useMemo(() => {
        const transforms: ChairTransform[] = [];
        if (count === 0) return transforms;

        // Helper structs
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
            // User snippet: radius = tableTop.length / 2000 + chairOffset;
            // Here we use width for round tables usually (diameter). 
            // Existing code used `width / 2`. Let's assume width is Diameter.
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

        const computeRectangleLikeChairs = () => {
            const { longSide, shortSide } = resolveSeatDistribution(count);

            // Half dimensions in meters
            const halfX = length / 2000;
            const halfZ = width / 2000;
            const o = chairOffset;

            // Spacing based on Segment Center (Length / N)
            // This pulls chairs away from each other compared to 1/(N+1) padding on small tables.
            // Width of usable area = halfX * 2.
            // Segment Width = (halfX * 2) / longSide.
            // Center of segment i = Start + (SegmentWidth * i) + (SegmentWidth / 2)

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
                // Right Head (Positive X)
                transforms.push({
                    position: [halfX + o, 0, 0],
                    rotation: [0, -Math.PI / 2, 0],
                });

                // Left Head (Negative X)
                transforms.push({
                    position: [-halfX - o, 0, 0],
                    rotation: [0, Math.PI / 2, 0],
                });
            }
        };

        const distributeSquareChairs = (total: number) => {
            // Return counts for [Top, Bottom, Right, Left]
            // Prioritize opposite sides (Top/Bottom, then Right/Left)
            // Total 1: [1, 0, 0, 0]
            // Total 2: [1, 1, 0, 0]
            // Total 3: [1, 1, 1, 0]
            // Total 4: [1, 1, 1, 1]
            // Total 5: [2, 1, 1, 1] ? Or [2, 2, 1, 0]?
            // Let's assume user wants pairs if possible.
            // But UI allows +=2. So usually 2, 4, 6, 8.
            // 2: 1 Top, 1 Bottom.
            // 4: 1 Top, 1 Bottom, 1 Right, 1 Left.
            // 6: 2 Top, 2 Bottom, 1 Right, 1 Left.
            // 8: 2 Top, 2 Bottom, 2 Right, 2 Left.

            // Base distribution: total / 4 (floor).
            const base = Math.floor(total / 4);
            const remainder = total % 4;

            // Remainder handling:
            // 1: Top (+1)
            // 2: Top (+1), Bottom (+1)
            // 3: Top (+1), Bottom (+1), Right (+1)

            const counts = [base, base, base, base]; // Top, Bottom, Right, Left

            if (remainder >= 1) counts[0]++; // Top
            if (remainder >= 2) counts[1]++; // Bottom (Opposite)
            if (remainder >= 3) counts[2]++; // Right (Side)

            return counts;
        };

        const computeSquareChairs = () => {
            const half = length / 2000;
            const o = chairOffset;

            const [topCount, bottomCount, rightCount, leftCount] = distributeSquareChairs(count);

            // Note: We need to push EXACTLY `count` transforms in the order we want them consumed.
            // Since distributeSquareChairs accounts for `count`, the sum of counts equals `count`.
            // The existing `ChairModel` uses `position[i]`, so order matters ONLY if we had extra chairs.
            // Here we generate exactly `count`.

            // Top (Z negative)
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

            // Bottom (Z positive) -- Prioritize filling opposite!
            // Wait, does order in array matter? 
            // If count=2, we have Top=1, Bottom=1.
            // Push Top, Push Bottom. Array = [TopTheoryPos, BottomTheoryPos].
            // ChairModel renders chair 0 at Top, chair 1 at Bottom.
            // Correct.

            if (bottomCount > 0) {
                const seg = (half * 2) / bottomCount;
                for (let i = 0; i < bottomCount; i++) {
                    // Start from right to left or left to right? 
                    // Usually doesn't matter for symmetry if centered.
                    // Left (-half) to Right (+half)
                    const x = -half + (seg * i) + (seg / 2);
                    transforms.push({
                        position: [x, 0, half + o],
                        rotation: [0, Math.PI, 0],
                    });
                }
            }

            // Right (X positive)
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

            // Left (X negative)
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
            case "oval":
                computeRectangleLikeChairs();
                break;
            case "round":
            case "roundCircle": // Matching existing ID
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
