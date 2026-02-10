import { observer } from "mobx-react-lite";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../context/StoreContext";
import { useMemo, useLayoutEffect, useEffect } from "react";
import * as THREE from "three";
import { useChairPositions } from "../utils/useChairPositions";
import { useTextureNonSuspense } from "../hooks/useTextureNonSuspense";
import gsap from "gsap";

export const ChairModel = observer(
  ({ view }: { view: string }) => {
    const { chairStore } = useStore();
    const positions = useChairPositions();

    const shape = chairStore.selectedChair;
    const color = chairStore.selectedColor;

    const gltf = useGLTF(shape.glbUrl);


    const { textures: texturesLeg } = useTextureNonSuspense({
      map: color.chairLegColor,
      normalMap: color.chairLegNormal,
      metalnessMap: color.chairLegMetalness,
      roughnessMap: color.chairLegRoughness
    });

    const { textures: texturesTop } = useTextureNonSuspense({
      map: color.chairTopColor,
      normalMap: color.chairTopNormal,
      metalnessMap: color.chairTopMetalness,
      roughnessMap: color.chairTopRoughness
    });

    const materials = useMemo(() => {
      return {
        leg: new THREE.MeshStandardMaterial({
        }),
        top: new THREE.MeshStandardMaterial({
        })
      };
    }, []);

    useEffect(() => {
      if (!texturesLeg || !texturesTop) return;

      // Update Leg Material
      materials.leg.map = texturesLeg.map;
      materials.leg.normalMap = texturesLeg.normalMap;
      materials.leg.roughnessMap = texturesLeg.roughnessMap;
      materials.leg.metalnessMap = texturesLeg.metalnessMap;
      materials.leg.needsUpdate = true;

      // Update Top Material
      materials.top.map = texturesTop.map;
      materials.top.normalMap = texturesTop.normalMap;
      materials.top.roughnessMap = texturesTop.roughnessMap;
      materials.top.metalnessMap = texturesTop.metalnessMap;
      materials.top.needsUpdate = true;
    }, [materials, texturesLeg, texturesTop]);

    useEffect(() => {
      gsap.killTweensOf([materials.leg.emissive, materials.top.emissive]);

      gsap.fromTo(
        [materials.leg.emissive, materials.top.emissive],
        { r: 0.5, g: 0.5, b: 0.5 },
        { r: 0, g: 0, b: 0, duration: 0.25, ease: 'power2.out' }
      );

    }, [materials, color]);

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
