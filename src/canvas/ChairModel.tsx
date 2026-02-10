import { observer } from "mobx-react-lite";
import { useGLTF, useTexture } from "@react-three/drei";
import { useStore } from "../context/StoreContext";
import { useMemo, useLayoutEffect, useEffect } from "react";
import * as THREE from "three";
import { useChairPositions } from "../utils/useChairPositions";
import gsap from "gsap";

export const ChairModel = observer(
  ({ view }: { view: string }) => {
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
      const setupSRGB = (t: any) => {
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 16;
        t.flipY = false;
      };
      const setupLinear = (t: any) => {
        t.colorSpace = THREE.LinearSRGBColorSpace;
        t.flipY = false;
      };

      setupSRGB(texturesLeg.map);
      setupLinear(texturesLeg.normalMap);
      setupLinear(texturesLeg.roughnessMap);
      setupLinear(texturesLeg.metalnessMap);

      setupSRGB(texturesTop.map);
      setupLinear(texturesTop.normalMap);
      setupLinear(texturesTop.roughnessMap);
      setupLinear(texturesTop.metalnessMap);
    }, [texturesLeg, texturesTop]);

    const materials = useMemo(() => {
      return {
        leg: new THREE.MeshStandardMaterial({
          map: texturesLeg.map,
          normalMap: texturesLeg.normalMap,
          roughnessMap: texturesLeg.roughnessMap,
          metalnessMap: texturesLeg.metalnessMap,
        }),
        top: new THREE.MeshStandardMaterial({
          map: texturesTop.map,
          normalMap: texturesTop.normalMap,
          roughnessMap: texturesTop.roughnessMap,
          metalnessMap: texturesTop.metalnessMap,
        })
      };
    }, [texturesLeg, texturesTop]);

    useEffect(() => {
      gsap.killTweensOf([materials.leg.emissive, materials.top.emissive]);
      gsap.fromTo(
        [materials.leg.emissive, materials.top.emissive],
        { r: 0.5, g: 0.5, b: 0.5 },
        { r: 0, g: 0, b: 0, duration: 0.25, ease: 'power2.out' }
      );
    }, [materials, color]); // Added color dependency

    const chairs = useMemo(() => {
      return Array.from({ length: chairStore.count }).map(() =>
        gltf.scene.clone(true)
      );
    }, [gltf.scene, chairStore.count]);

    useLayoutEffect(() => {
      chairs.forEach(scene => {
        scene.traverse((child: any) => {
          if (!child.isMesh) return;

          if (child.name.includes("Leg")) child.material = materials.leg;
          if (child.name.includes("Top")) child.material = materials.top;
        });
      });
    }, [chairs, materials]);

    if (
      view === "frontView" ||
      view === "leftView" ||
      view === "topView" ||
      view === "rightView"
    ) {
      return null;
    }

    if (view === "twoChairView") {
      return (
        <group>
          <primitive
            object={chairs[0]}
            position={[-0.3, 0, 0]}
            rotation={[0, Math.PI, 0]}
          />
          <primitive
            object={chairs[1]}
            position={[0.3, 0, 0]}
            rotation={[0, Math.PI * 2, 0]}
          />
        </group>
      );
    }

    return (
      <group>
        {chairs.map((scene, i) => {
          const transform =
            positions[i] || { position: [0, 0, 0], rotation: [0, 0, 0] };

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
  }
);
