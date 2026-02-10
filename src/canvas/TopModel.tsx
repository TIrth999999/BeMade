import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo } from "react";
import topShapes from "../data/topShapes.json";
import gsap from "gsap";
import { useTextureNonSuspense } from "../hooks/useTextureNonSuspense";

topShapes.forEach(shape => {
  useGLTF.preload(shape.glbUrl);
  useGLTF.preload(shape.mdfUrl);
});

const SingleTopModel = observer(({ shape, isVisible, baseMaterial, mdfMaterial }: { shape: any, isVisible: boolean, baseMaterial: THREE.MeshStandardMaterial, mdfMaterial: THREE.MeshStandardMaterial }) => {
  const { dimensionsStore } = useStore();

  const gltf = useGLTF(shape.glbUrl) as any;
  const gltf2 = useGLTF(shape.mdfUrl) as any;

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

  useEffect(() => {
    if (!isVisible) return;

    const map = baseMaterial.map;
    if (!map) return;

    const isCircleOrSquare = shape.id === "roundCircle" || shape.id === "square";
    const scaleX = isCircleOrSquare
      ? dimensionsStore.length / shape.defaultLength
      : dimensionsStore.length / shape.defaultLength;
    const scaleY = isCircleOrSquare
      ? dimensionsStore.length / shape.defaultLength
      : dimensionsStore.width / shape.defaultWidth;

    const centerX = isCircleOrSquare ? 0.8 : 0.5;
    const centerY = 0.8;

    const setProps = (tex: THREE.Texture) => {
      tex.center.set(centerX, centerY);
      tex.repeat.set(scaleX, scaleY);
    };

    if (baseMaterial.map) setProps(baseMaterial.map);
    if (baseMaterial.normalMap) setProps(baseMaterial.normalMap);
    if (baseMaterial.roughnessMap) setProps(baseMaterial.roughnessMap);
    if (baseMaterial.metalnessMap) setProps(baseMaterial.metalnessMap);

    if (mdfMaterial.map) setProps(mdfMaterial.map);
    if (mdfMaterial.normalMap) setProps(mdfMaterial.normalMap);
    if (mdfMaterial.roughnessMap) setProps(mdfMaterial.roughnessMap);
    if (mdfMaterial.metalnessMap) setProps(mdfMaterial.metalnessMap);

  }, [isVisible, dimensionsStore.length, dimensionsStore.width, shape, baseMaterial.map, mdfMaterial]);

  const isCircleOrSquare = shape.id === "roundCircle" || shape.id === "square";
  const scale: [number, number, number] = isCircleOrSquare
    ? [
      dimensionsStore.length / shape.defaultLength,
      1,
      dimensionsStore.length / shape.defaultLength,
    ]
    : [
      dimensionsStore.length / shape.defaultLength,
      1,
      dimensionsStore.width / shape.defaultWidth,
    ];

  return (
    <group visible={isVisible}>
      <primitive object={gltf.scene} scale={scale} />
      <primitive object={gltf2.scene} scale={scale} />
    </group>
  );
});

export const TopModel = observer(() => {
  const {
    topShapeStore,
    topColorStore,
    uiStore,
  } = useStore();

  const color = topColorStore.selectedColor;

  const { textures, loading } = useTextureNonSuspense({
    map: color.baseUrl,
    normalMap: color.normalUrl,
    roughnessMap: color.roughnessUrl,
    metalnessMap: color.metalnessUrl,
  });

  const baseMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      metalness: 0.8,
      roughness: 0.5,
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

    gsap.killTweensOf(baseMaterial.emissive);
    gsap.fromTo(
      baseMaterial.emissive,
      { r: 0.5, g: 0.5, b: 0.5 },
      { r: 0, g: 0, b: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [textures, baseMaterial, mdfMaterial, topColorStore.selectedColorId]);

  return (
    <>
      {topShapes.map((shape) => (
        <SingleTopModel
          key={shape.id}
          shape={shape}
          isVisible={topShapeStore.selectedTopShape.id === shape.id}
          baseMaterial={baseMaterial}
          mdfMaterial={mdfMaterial}
        />
      ))}
    </>
  );
});
