import { Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { BaseModel } from "./BaseModel";
import { TopModel } from "./TopModel";
import { ContactShadows } from "@react-three/drei";
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

  const { cameraPositionStore, baseStore, chairStore, topShapeStore, topColorStore, uiStore, dimensionsStore } = useStore();

  const isSceneReady =
    !uiStore.baseLoading &&
    !uiStore.topLoading &&
    !uiStore.chairLoading;

  const shadowKey = [
    baseStore.selectedBase.id,
    chairStore.count,
    chairStore.selectedChair.id,
    topShapeStore.selectedTopShape.id,
    topColorStore.selectedTopColor.id,
    cameraPositionStore.selectedCameraPositionName,
    dimensionsStore.length,
    dimensionsStore.width,
  ].join("-");


  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: cameraPositionStore.selectedCameraPosition.fov }}
      gl={{
        antialias: true,
        preserveDrawingBuffer: true,
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.02
      }}>
      <CameraSetup />

      <directionalLight
        position={[-6, 7, 2]}
        intensity={1.9}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
        shadow-normalBias={0.02}
      />


      <directionalLight
        position={[3, 0.1, 0]}
        intensity={4}
      />

      <directionalLight
        position={[-3, 0.1, 0]}
        intensity={3}
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
          position={[0, 0, 0]}
          scale={10}
          blur={0.35}
          far={1}
          opacity={0.7}
          frames={1}
        />
      )}

      <ScreenshotHandler />

    </Canvas>
  );
});