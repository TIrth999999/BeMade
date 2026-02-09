import { observer } from "mobx-react-lite";
import { useGLTF, useTexture } from "@react-three/drei";
import { useStore } from "../context/StoreContext";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import baseShapes from "../data/baseShapes.json";

baseShapes.forEach(shape => {
  useGLTF.preload(shape.glbUrl);
  if (shape.smallGlbUrl) {
    useGLTF.preload(shape.smallGlbUrl);
  }
});

export const BaseModel = observer(() => {
  const { baseStore, dimensionsStore, cameraPositionStore } = useStore();
  const prevBaseId = useRef<string | null>(null);


  const glbUrl = useMemo(() => {
    if (
      baseStore.selectedBase.id === "cradle" &&
      dimensionsStore.length < 2500
    ) {
      return baseStore.selectedBase.smallGlbUrl;
    }
    return baseStore.selectedBase.glbUrl;
  }, [
    baseStore.selectedBase.id,
    baseStore.selectedBase.glbUrl,
    baseStore.selectedBase.smallGlbUrl,
    dimensionsStore.length,
  ]);

  const gltf = useGLTF(glbUrl);
  const color = baseStore.selectedBaseColor;

  console.log(gltf.scene);

  const textures = useTexture({
    map: color.baseUrl,
    normalMap: color.normalUrl,
    metalnessMap: color.metalnessUrl,
    roughnessMap: color.roughnessUrl
  });
  textures.map.colorSpace = THREE.SRGBColorSpace;
  textures.map.anisotropy = 16;
  textures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  textures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  textures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;

  Object.values(textures).forEach((texture) => {
    texture.flipY = false;
  });

  let distance = 0;

  useEffect(() => {
    gltf.scene.traverse((child: any) => {
      if (!child.isMesh) return;

      distance += Math.max(distance, child.geometry.boundingSphere.radius);

      if (!child.material || child.material.type !== 'MeshStandardMaterial') {
        child.material = new THREE.MeshStandardMaterial();
      }

      child.material.map = textures.map;
      child.material.normalMap = textures.normalMap;
      child.material.roughnessMap = textures.roughnessMap;
      child.material.metalnessMap = textures.metalnessMap;
      child.material.metalness = 0.65;
      child.material.roughness = 0.5;

      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = false;
    });
  }, [gltf.scene, textures, baseStore.selectedBaseId]);


  const originalPositions = useRef<{ left: number; right: number } | null>(null);

  useEffect(() => {
    if (baseStore.selectedBase.id !== "linea" && baseStore.selectedBase.id !== "curva" && baseStore.selectedBase.id !== "twiste" && baseStore.selectedBase.id !== "moon") return;
    originalPositions.current = null;
    prevBaseId.current = baseStore.selectedBaseId;
  }, [baseStore.selectedBaseId, baseStore.selectedBase.id, gltf.scene]);

  useLayoutEffect(() => {
    if (prevBaseId.current !== baseStore.selectedBaseId) return;
    if (baseStore.selectedBase.id !== "linea" && baseStore.selectedBase.id !== "curva" && baseStore.selectedBase.id !== "twiste" && baseStore.selectedBase.id !== "moon") return;
    if (!gltf.scene) return;

    const meshes: any[] = [];
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) meshes.push(child);
    });
    if (meshes.length === 0) return;

    let leftMesh = meshes[0];
    let rightMesh = meshes[0];
    let leftX = Infinity;
    let rightX = -Infinity;

    meshes.forEach((mesh) => {
      mesh.geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      mesh.geometry.boundingBox.getCenter(center);
      mesh.localToWorld(center);

      if (center.x < leftX) {
        leftX = center.x;
        leftMesh = mesh;
      }
      if (center.x > rightX) {
        rightX = center.x;
        rightMesh = mesh;
      }
    });

    let centerX = (leftX + rightX) / 2;

    if (!originalPositions.current) {
      originalPositions.current = {
        left: leftMesh.position.x,
        right: rightMesh.position.x,
      };
    }

    const maxShift = (centerX - leftX);

    const shiftFactor = 1 - Math.min(dimensionsStore.length, 3100) / 3100;
    leftMesh.position.x = originalPositions.current.left + maxShift * shiftFactor;
    rightMesh.position.x = originalPositions.current.right - maxShift * shiftFactor;

  }, [dimensionsStore.length, gltf.scene, baseStore.selectedBaseId, baseStore.selectedBase]);

  if (cameraPositionStore.selectedCameraPositionName === "twoChairView"){
    return <></>
  }

  return <>
    <primitive object={gltf.scene} />
  </>;
});
