import { observer } from "mobx-react-lite";
import { useGLTF } from "@react-three/drei";
import { useStore } from "../context/StoreContext";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import baseShapes from "../data/baseShapes.json";
import { useTextureNonSuspense } from "../hooks/useTextureNonSuspense";

baseShapes.forEach(shape => {
  useGLTF.preload(shape.glbUrl);
  if (shape.smallGlbUrl) {
    useGLTF.preload(shape.smallGlbUrl);
  }
});

const SingleBaseModel = observer(({ shape, isVisible, sharedMaterial, texturesReady }: { shape: any, isVisible: boolean, sharedMaterial: THREE.MeshStandardMaterial, texturesReady: boolean }) => {
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
  const { uiStore } = useStore();

  useLayoutEffect(() => {
    setReady(false);
    uiStore.setBaseLoading(true);
    // No cleanup so we don't accidentally turn off loading if another component is still loading
  }, [shape.id]);

  useLayoutEffect(() => {
    if (!gltf.scene || !texturesReady) {
      setReady(false);
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
      uiStore.setBaseLoading(false);
    });

  }, [gltf.scene, sharedMaterial, texturesReady]);


  const originalPositions = useRef<{ left: number; right: number } | null>(null);

  useEffect(() => {
    if (shape.id !== "linea" && shape.id !== "curva" && shape.id !== "twiste" && shape.id !== "moon") return;
  }, [glbUrl]);

  useLayoutEffect(() => {
    if (!isVisible) return;
    if (shape.id !== "linea" && shape.id !== "curva" && shape.id !== "twiste" && shape.id !== "moon") return;
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


    if (!originalPositions.current) {
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

      originalPositions.current = {
        left: leftMesh.position.x,
        right: rightMesh.position.x,
      };
    }

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

    const maxShift = (centerX - leftX);

    const shiftFactor = 1 - Math.min(dimensionsStore.length, 3100) / 3100;

    if (originalPositions.current) {
      leftMesh.position.x = originalPositions.current.left + maxShift * shiftFactor;
      rightMesh.position.x = originalPositions.current.right - maxShift * shiftFactor;
    }

  }, [dimensionsStore.length, gltf.scene, isVisible]);

  if (!ready) return null;

  return <primitive object={gltf.scene} visible={isVisible} />;
});

export const BaseModel = observer(() => {
  const { baseStore } = useStore();
  const color = baseStore.selectedBaseColor;

  const { textures, loading } = useTextureNonSuspense({
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

  useEffect(() => {
    baseStore.root.uiStore.setBaseLoading(loading);
  }, [loading, baseStore.root.uiStore]);

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
    if (id === "linea" || id === "lineadome" || id === "lineaContour") {
      sharedMaterial.color.set('#f5e8d0');
    } else {
      // sharedMaterial.color.set('white');
    }

    // sharedMaterial.emissive.setHex(0x000000);

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
          />
        );
      })}
    </>
  );
});