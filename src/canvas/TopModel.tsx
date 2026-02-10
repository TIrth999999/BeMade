import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import topShapes from "../data/topShapes.json";
import gsap from "gsap";
import { useTopTextures } from "../hooks/useTopTextures";

topShapes.forEach(shape => {
  useGLTF.preload(shape.glbUrl);
  useGLTF.preload(shape.mdfUrl);
});

export const TopModel = observer(() => {
  const {
    topShapeStore,
    topColorStore,
    dimensionsStore,
    uiStore,
  } = useStore();

  const shape = topShapeStore.selectedTopShape;
  const color = topColorStore.selectedColor;

  const gltf = useGLTF(shape.glbUrl);
  const gltf2 = useGLTF(shape.mdfUrl);

  const { textures, loading } = useTopTextures(color);

  const baseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      metalness: 0.8,
      roughness: 0.5,
      transparent: true,
      opacity: 1,
    });
  }, []);

  const mdfMaterial = useMemo(() => {
    const m = baseMaterial.clone();
    m.metalness = 1;
    return m;
  }, [baseMaterial]);

  useEffect(() => {
    uiStore.setTopLoading(loading);
  }, [loading, uiStore]);

  useEffect(() => {
    if (!textures) return;

    baseMaterial.map = textures.map;
    baseMaterial.normalMap = textures.normalMap;
    baseMaterial.roughnessMap = textures.roughnessMap;
    baseMaterial.metalnessMap = textures.metalnessMap;
    baseMaterial.needsUpdate = true;

    mdfMaterial.map = textures.map;
    mdfMaterial.normalMap = textures.normalMap;
    mdfMaterial.roughnessMap = textures.roughnessMap;
    mdfMaterial.metalnessMap = textures.metalnessMap;
    mdfMaterial.needsUpdate = true;

    gsap.fromTo(
      baseMaterial,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: "sine.inOut" }
    );
  }, [textures, baseMaterial, mdfMaterial]);

  useEffect(() => {
    if (!textures) return;

    const scaleX = dimensionsStore.length / shape.defaultLength;
    const scaleY = dimensionsStore.width / shape.defaultWidth;

    textures.map.center.set(0.5, 0.8);
    textures.normalMap.center.set(0.5, 0.8);
    textures.roughnessMap.center.set(0.5, 0.8);
    textures.metalnessMap.center.set(0.5, 0.8);

    textures.map.repeat.set(scaleX, scaleY);
    textures.normalMap.repeat.set(scaleX, scaleY);
    textures.roughnessMap.repeat.set(scaleX, scaleY);
    textures.metalnessMap.repeat.set(scaleX, scaleY);
  }, [textures, dimensionsStore.length, dimensionsStore.width, shape]);

  useEffect(() => {
    const apply = (scene: THREE.Group, mat: THREE.Material) => {
      scene.traverse((c: any) => {
        if (!c.isMesh) return;
        c.castShadow = true;
        c.receiveShadow = true;
        c.material = mat;
      });
    };

    apply(gltf.scene, baseMaterial);
    apply(gltf2.scene, mdfMaterial);
  }, [gltf.scene, gltf2.scene, baseMaterial, mdfMaterial]);

  const scale: [number, number, number] = [
    dimensionsStore.length / shape.defaultLength,
    1,
    dimensionsStore.width / shape.defaultWidth,
  ];

  return (
    <>
      <primitive object={gltf.scene} scale={scale} />
      <primitive object={gltf2.scene} scale={scale} />
    </>
  );
});
