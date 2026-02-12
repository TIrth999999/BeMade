import { Suspense, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { BaseModel } from "./BaseModel";
import { TopModel } from "./TopModel";
import { ContactShadows, PerformanceMonitor } from "@react-three/drei";
import * as THREE from 'three';
import { CameraSetup } from "./Camera";
import { ChairModel } from "./ChairModel";
import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";

export const ScreenshotHandler = observer(() => {
  const { gl, scene, camera, invalidate } = useThree();
  const { uiStore } = useStore();

  useEffect(() => {
    if (!uiStore.takeScreenshot) return;

    invalidate();

    requestAnimationFrame(() => {
      gl.render(scene, camera);
      const dataURL = gl.domElement.toDataURL("image/png");

      uiStore.setScreenshot(dataURL);
      uiStore.resetScreenshotTrigger();
    });

  }, [uiStore.takeScreenshot]);

  return null;
});

const BaseLoadingHandler = observer(() => {
  const { uiStore } = useStore();
  useEffect(() => {
    uiStore.setBaseLoading(true);
    return () => uiStore.setBaseLoading(false);
  }, [uiStore]);
  return null;
});
const TopLoadingHandler = observer(() => {
  const { uiStore } = useStore();
  useEffect(() => {
    uiStore.setTopLoading(true);
    return () => uiStore.setTopLoading(false);
  }, [uiStore]);
  return null;
});
const ChairLoadingHandler = observer(() => {
  const { uiStore } = useStore();
  useEffect(() => {
    uiStore.setChairLoading(true);
    return () => uiStore.setChairLoading(false);
  }, [uiStore]);
  return null;
});


export const CanvasRoot = observer(() => {
  const { cameraPositionStore, uiStore, baseStore, chairStore, topShapeStore, dimensionsStore } = useStore();
  // Ensure we observe isFullscreen here so Canvas re-renders and updates its camera settings
  const { isFullscreen, isMobile } = uiStore;
  const [dpr, setDpr] = useState(1.5);

  const fovBoost = isMobile ? (isFullscreen ? 85 : 15) : 0;

  const isSceneReady =
    !uiStore.baseLoading &&
    !uiStore.topLoading &&
    !uiStore.chairLoading;

  const shadowKey = [
    baseStore.selectedBase.id,
    chairStore.count,
    topShapeStore.selectedTopShape.id,
    dimensionsStore.length,
    dimensionsStore.width,
  ].join("-");

  const baseFov = cameraPositionStore.selectedCameraPosition.fov;
  const fov = baseFov + fovBoost;

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ fov }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.02,
        powerPreference: "high-performance"
      }}
    >
      <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)} />
      <CameraSetup />

      <directionalLight
        position={[-6, 7, 2]}
        intensity={1.9}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />

      <directionalLight
        position={[3, 0, 3]}
        intensity={4}
      />

      <directionalLight
        position={[-3, 0, -3]}
        intensity={4}
      />

      <ambientLight intensity={0.7} />

      {cameraPositionStore.selectedCameraPositionName !== "twoChairView" && (
        <Suspense fallback={<BaseLoadingHandler />}>
          <BaseModel />
        </Suspense>
      )}

      {cameraPositionStore.selectedCameraPositionName !== "twoChairView" && (
        <Suspense fallback={<TopLoadingHandler />}>
          <TopModel />
        </Suspense>
      )}

      <Suspense fallback={<ChairLoadingHandler />}>
        <ChairModel
          view={cameraPositionStore.selectedCameraPositionName}
        />
      </Suspense>

      {isSceneReady && (
        <ContactShadows
          key={shadowKey}
          position={[0, 0, 0.08]}
          scale={10}
          blur={0.35}
          far={1}
          opacity={0.4}
          frames={1}
        />
      )}

      <ScreenshotHandler />

    </Canvas>
  );
});