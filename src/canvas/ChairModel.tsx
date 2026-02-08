import { observer } from "mobx-react-lite";
import { useGLTF, useTexture } from "@react-three/drei";
import { useStore } from "../context/StoreContext";
import { useMemo, useLayoutEffect } from "react";
import * as THREE from "three";
import { useChairPositions } from "../utils/useChairPositions";
import chairData from "../data/chairData.json";

// Preload all chair models
chairData.forEach(chair => {
    useGLTF.preload(chair.glbUrl);
});

export const ChairModel = observer(() => {
    const { chairStore } = useStore();
    const positions = useChairPositions();

    const shape = chairStore.selectedChair;
    const color = chairStore.selectedColor;

    const gltf = useGLTF(shape.glbUrl);

    const texturesLeg = useTexture({
        map: color.chairLegColor,
        normalMap: color.chairLegNormal,
        metalnessMap: color.chairLegMetalness,
        roughnessMap: color.chairLegRoughness
    });

    const texturesTop = useTexture({
        map: color.chairTopColor,
        normalMap: color.chairTopNormal,
        metalnessMap: color.chairTopMetalness,
        roughnessMap: color.chairTopRoughness
    });

    useMemo(() => {
        const setupTexture = (t: any) => {
            t.colorSpace = THREE.SRGBColorSpace;
            t.anisotropy = 16;
            t.flipY = false;
        };
        const setupLinearTexture = (t: any) => {
            t.colorSpace = THREE.LinearSRGBColorSpace;
            t.flipY = false;
        };

        setupTexture(texturesLeg.map);
        setupLinearTexture(texturesLeg.normalMap);
        setupLinearTexture(texturesLeg.roughnessMap);
        setupLinearTexture(texturesLeg.metalnessMap);

        setupTexture(texturesTop.map);
        setupLinearTexture(texturesTop.normalMap);
        setupLinearTexture(texturesTop.roughnessMap);
        setupLinearTexture(texturesTop.metalnessMap);
    }, [texturesLeg, texturesTop]);

    const materials = useMemo(() => {
        const legMat = new THREE.MeshStandardMaterial({
            map: texturesLeg.map,
            normalMap: texturesLeg.normalMap,
            roughnessMap: texturesLeg.roughnessMap,
            metalnessMap: texturesLeg.metalnessMap,
        });

        const topMat = new THREE.MeshStandardMaterial({
            map: texturesTop.map,
            normalMap: texturesTop.normalMap,
            roughnessMap: texturesTop.roughnessMap,
            metalnessMap: texturesTop.metalnessMap,
        });

        return { leg: legMat, top: topMat };
    }, [texturesLeg, texturesTop]);

    const chairs = useMemo(() => {
        return Array.from({ length: chairStore.count }).map(() => gltf.scene.clone(true));
    }, [gltf.scene, chairStore.count]);

    useLayoutEffect(() => {
        chairs.forEach((chairScene) => {
            chairScene.traverse((child: any) => {
                if (!child.isMesh) return;

                if (child.name.includes("Leg")) {
                    child.material = materials.leg;
                } else if (child.name.includes("Top")) {
                    child.material = materials.top;
                }
                child.castShadow = true;
                child.receiveShadow = true;
            });
        });
    }, [chairs, materials]);

    return (
        <group>
            {chairs.map((scene, i) => {
                const transform = positions[i] || { position: [0, 0, 0], rotation: [0, 0, 0] };
                return (
                    <primitive
                        key={`chair-${shape.id}-${i}`}
                        object={scene}
                        position={transform.position}
                        rotation={transform.rotation}
                    />
                );
            })}
        </group>
    );
});
