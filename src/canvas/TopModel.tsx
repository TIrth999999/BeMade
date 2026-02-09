import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import topShapes from "../data/topShapes.json";
import gsap from "gsap";

topShapes.forEach(shape => {
  useGLTF.preload(shape.glbUrl);
  useGLTF.preload(shape.mdfUrl);
});

export const TopModel = observer(() => {
  const { topShapeStore, topColorStore, dimensionsStore } = useStore();

  const shape = topShapeStore.selectedTopShape;
  const color = topColorStore.selectedColor;

  const gltf = useGLTF(shape.glbUrl);
  const gltf2 = useGLTF(shape.mdfUrl);

  const textures = useTexture(
    useMemo(() => ({
      map: color.baseUrl,
      normalMap: color.normalUrl,
      roughnessMap: color.roughnessUrl,
      metalnessMap: color.metalnessUrl,
    }), [
      color.baseUrl,
      color.normalUrl,
      color.roughnessUrl,
      color.metalnessUrl,
    ])
  );

  useMemo(() => {
    textures.map.colorSpace = THREE.SRGBColorSpace;
    textures.map.anisotropy = 16;

    textures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    textures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    textures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;

    textures.map.wrapS = THREE.RepeatWrapping;
    textures.map.wrapT = THREE.RepeatWrapping;


    Object.values(textures).forEach(t => {
      t.flipY = false;
      t.needsUpdate = true;
    });

    return textures;
  }, [textures]);

  const baseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: textures.map,
      normalMap: textures.normalMap,
      roughnessMap: textures.roughnessMap,
      metalnessMap: textures.metalnessMap,
      metalness: 0.8,
      roughness: 0.5,
      transparent: true,
      opacity: 0.5,
    });
  }, [textures]);

  const mdfMaterial = useMemo(() => {
    return baseMaterial.clone();
  }, [baseMaterial]);

  useMemo(() => {
    mdfMaterial.metalness = 1;
    return mdfMaterial;
  }, [mdfMaterial]);
  
  useEffect(() => {
    const applyMaterial = (scene: THREE.Group, material: THREE.Material) => {
      scene.traverse((child: any) => {
        if (!child.isMesh) return;

        child.castShadow = true;
        child.receiveShadow = true;
        child.material = material;

        gsap.fromTo(
          child.material,
          { opacity: 0 },
          { opacity: 1, duration: 0.23, ease: "none" }
        );
      });
    };

    applyMaterial(gltf.scene, baseMaterial);
    applyMaterial(gltf2.scene, mdfMaterial);
  }, [gltf.scene, gltf2.scene, baseMaterial, mdfMaterial]);

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
