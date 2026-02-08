import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

export const TopModel = observer(() => {
  const { topShapeStore, topColorStore, dimensionsStore } = useStore();

  const gltf = useGLTF(topShapeStore.selectedTopShape.glbUrl);
  // console.log(gltf.scene);
  const gltf2 = useGLTF(topShapeStore.selectedTopShape.mdfUrl);
  const color = topColorStore.selectedColor;


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
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        child.material = new THREE.MeshStandardMaterial({
          map: textures.map,
          normalMap: textures.normalMap,
          roughnessMap: textures.roughnessMap,
          metalnessMap: textures.metalnessMap,
          metalness: 0.8,
          roughness: 0.5,
        });

        child.material.needsUpdate = true;
      }
    });

    gltf2.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        child.material = new THREE.MeshStandardMaterial({
          map: textures.map,
          normalMap: textures.normalMap,
          roughnessMap: textures.roughnessMap,
          metalnessMap: textures.metalnessMap,
          metalness: 1,
          roughness: 0.5,
        });

        child.material.needsUpdate = true;
      }
    });
  }, [gltf, gltf2, textures]);

  return <>
    <primitive object={gltf.scene} scale={[dimensionsStore.length / topShapeStore.selectedTopShape.defaultLength, 1, dimensionsStore.width / topShapeStore.selectedTopShape.defaultWidth]} />
    <primitive object={gltf2.scene} scale={[dimensionsStore.length / topShapeStore.selectedTopShape.defaultLength, 1, dimensionsStore.width / topShapeStore.selectedTopShape.defaultWidth]} />
  </>;
});
