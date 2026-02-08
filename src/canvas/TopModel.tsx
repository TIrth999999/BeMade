import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

export const TopModel = observer(() => {
  const { topShapeStore, topColorStore, dimensionsStore } = useStore();

  const shape = topShapeStore.selectedTopShape;
  const color = topColorStore.selectedColor;

  const gltf = useGLTF(shape.glbUrl);
  const gltf2 = useGLTF(shape.mdfUrl);

  const textures = useTexture({
    map: color.baseUrl,
    normalMap: color.normalUrl,
    roughnessMap: color.roughnessUrl,
    metalnessMap: color.metalnessUrl,
  });

  textures.map.colorSpace = THREE.SRGBColorSpace;
  textures.map.anisotropy = 16;
  textures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  textures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  textures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;

  Object.values(textures).forEach((texture) => {
    texture.flipY = false;
  });

  useEffect(() => {
    const applyMaterial = (scene: THREE.Group, metalness: number) => {
      scene.traverse((child: any) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            map: textures.map,
            normalMap: textures.normalMap,
            roughnessMap: textures.roughnessMap,
            metalnessMap: textures.metalnessMap,
            metalness: metalness,
            roughness: 0.5,
          });
          child.material.needsUpdate = true;
        }
      });
    };

    applyMaterial(gltf.scene, 0.8);
    applyMaterial(gltf2.scene, 1);
  }, [gltf, gltf2, textures]);

  const scale: [number, number, number] = [
    dimensionsStore.length / shape.defaultLength,
    1,
    dimensionsStore.width / shape.defaultWidth
  ];

  return <>
    <primitive object={gltf.scene} scale={scale} />
    <primitive object={gltf2.scene} scale={scale} />
  </>;
});
