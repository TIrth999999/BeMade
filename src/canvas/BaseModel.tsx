import { observer } from "mobx-react-lite";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../context/StoreContext";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import * as THREE from "three";
import baseShapes from "../data/baseShapes.json";
import { useTextureNonSuspense } from "../hooks/useTextureNonSuspense";

baseShapes.forEach(shape => {
  useGLTF.preload(shape.glbUrl);
  if (shape.smallGlbUrl) {
    useGLTF.preload(shape.smallGlbUrl);
  }
});

const SingleBaseModel = observer(({ shape, isVisible, sharedMaterial, texturesReady, onMeshReady }: { shape: any, isVisible: boolean, sharedMaterial: THREE.MeshStandardMaterial, texturesReady: boolean, onMeshReady: (ready: boolean) => void }) => {
  const { dimensionsStore } = useStore();

  const glbUrl = useMemo(() => {
    if (
      shape.id === "cradle" &&
      dimensionsStore.length < 2500 &&
      shape.smallGlbUrl
    ) {
      return shape.smallGlbUrl;
    }
    return shape.glbUrl;
  }, [shape, dimensionsStore.length]);

  const gltf = useGLTF(glbUrl) as any;

  const [ready, setReady] = useState(false);
  // const { uiStore } = useStore();

  // Always show loader until both mesh and textures are ready
  useLayoutEffect(() => {
    if (!gltf.scene || !texturesReady) {
      setReady(false);
      onMeshReady(false);
      return;
    }

    gltf.scene.traverse((child: any) => {
      if (!child.isMesh) return;
      child.material = sharedMaterial;
      child.castShadow = true;
      child.receiveShadow = false;
    });

    requestAnimationFrame(() => {
      setReady(true);
      onMeshReady(true);
    });
  }, [gltf.scene, sharedMaterial, texturesReady, onMeshReady]);


  useLayoutEffect(() => {
    if (!isVisible) return;
    if (shape.id !== "linea" && shape.id !== "curva" && shape.id !== "twiste" && shape.id !== "moon") return;
    if (!gltf.scene) return;

    const meshes: any[] = [];
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        meshes.push(child);
        // Store original position if not already stored to handle cached GLTF
        if (child.userData.originalX === undefined) {
          child.userData.originalX = child.position.x;
        }
      }
    });

    if (meshes.length < 2) return;

    // Identify left and right meshes based on their ORIGINAL positions
    let leftMesh = meshes[0];
    let rightMesh = meshes[0];
    let minX = Infinity;
    let maxX = -Infinity;

    meshes.forEach((mesh) => {
      if (mesh.userData.originalX < minX) {
        minX = mesh.userData.originalX;
        leftMesh = mesh;
      }
      if (mesh.userData.originalX > maxX) {
        maxX = mesh.userData.originalX;
        rightMesh = mesh;
      }
    });

    // Calculate center based on original bounds
    const originalCenter = (minX + maxX) / 2;
    const maxShift = originalCenter - minX;

    // Cap the shiftFactor at 0.45 to ensure they never fully collide
    // 3100 is the reference length where they are at original position
    const rawShiftFactor = 1 - Math.min(dimensionsStore.length, 3100) / 3100;
    const shiftFactor = Math.min(rawShiftFactor, 0.35);

    // Apply shift relative to original positions
    leftMesh.position.x = leftMesh.userData.originalX + maxShift * shiftFactor;
    rightMesh.position.x = rightMesh.userData.originalX - maxShift * shiftFactor;
  }, [dimensionsStore.length, gltf.scene, isVisible]);

  if (!ready || !texturesReady) return null;
  return <primitive object={gltf.scene} visible={isVisible} />;
});

export const BaseModel = observer(() => {
  const { baseStore } = useStore();
  const color = baseStore.selectedBaseColor;

  const { textures } = useTextureNonSuspense({
    map: color.baseUrl,
    normalMap: color.normalUrl,
    metalnessMap: color.metalnessUrl,
    roughnessMap: color.roughnessUrl,
  });

  const sharedMaterial = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial();
    mat.roughness = 0.65;
    mat.metalness = 0.45;
    return mat;
  }, [baseStore.selectedBase.id]);

  // Local state to track mesh readiness
  const [meshReady, setMeshReady] = useState(false);

  // Spinner is shown if mesh or textures are not ready
  useEffect(() => {
    baseStore.root.uiStore.setBaseLoading(!(meshReady && !!textures));
  }, [meshReady, textures, baseStore.root.uiStore]);

  useLayoutEffect(() => {
    if (!textures) {
      sharedMaterial.map = null;
      sharedMaterial.normalMap = null;
      sharedMaterial.roughnessMap = null;
      sharedMaterial.metalnessMap = null;
      sharedMaterial.needsUpdate = true;
      return;
    }

    sharedMaterial.map = textures.map;
    sharedMaterial.normalMap = textures.normalMap;
    sharedMaterial.roughnessMap = textures.roughnessMap;
    sharedMaterial.metalnessMap = textures.metalnessMap;

    if (sharedMaterial.map) sharedMaterial.map.anisotropy = 16;

    const id = baseStore.selectedBase.id;

    if (id === 'linea' || id === 'lineaContour') {
      sharedMaterial.side = THREE.DoubleSide;
    }

    if (id === "linea" || id === "lineadome" || id === "lineaContour") {
      sharedMaterial.color.set('#f5e8d0');
    }

    sharedMaterial.needsUpdate = true;
  }, [textures, baseStore.selectedBase.id, sharedMaterial]);

  return (
    <>
      {baseShapes.map((shape) => {
        if (baseStore.selectedBase.id !== shape.id) return null;
        return (
          <SingleBaseModel
            key={shape.id}
            shape={shape}
            isVisible={true}
            sharedMaterial={sharedMaterial}
            texturesReady={!!textures}
            onMeshReady={setMeshReady}
          />
        );
      })}
    </>
  );
});