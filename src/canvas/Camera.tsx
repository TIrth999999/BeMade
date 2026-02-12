import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useStore } from "../context/StoreContext";
import { observer } from "mobx-react-lite";
import { gsap } from "gsap";

export const CameraSetup = observer(() => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const tweenRef = useRef<gsap.core.Tween | gsap.core.Timeline | null>(null);

  const { cameraPositionStore, uiStore } = useStore();

  useEffect(() => {
    const target = new THREE.Vector3(0, 0.5, 0);
    const pos = cameraPositionStore.selectedCameraPosition.position;

    tweenRef.current?.kill();

    const isTopView = cameraPositionStore.selectedCameraPositionName === "topView" ||
      cameraPositionStore.selectedCameraPositionName === "chairTopView";
    const targetUp = isTopView ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);

    const dummyCamera = new THREE.PerspectiveCamera();
    dummyCamera.position.set(pos[0], pos[1], pos[2]);
    dummyCamera.up.copy(targetUp);
    dummyCamera.lookAt(target);
    dummyCamera.updateMatrixWorld();

    const startQuaternion = camera.quaternion.clone();
    const endQuaternion = dummyCamera.quaternion.clone();
    const startUp = camera.up.clone();
    const timeline = gsap.timeline({
      onComplete: () => {
        if (cameraPositionStore.isScreenshotFlow) {
          requestAnimationFrame(() => {
            uiStore.requestScreenshot();
            cameraPositionStore.endScreenshotFlow();
          });
        }
      }
    });

    timeline.to(camera.position, {
      x: pos[0],
      y: pos[1],
      z: pos[2],
      duration: 1.2,
      ease: "power2.inOut",
    }, 0);

    const rotationProxy = { t: 0 };
    timeline.to(rotationProxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.quaternion.slerpQuaternions(startQuaternion, endQuaternion, rotationProxy.t);
        camera.up.lerpVectors(startUp, targetUp, rotationProxy.t);

        if (controlsRef.current) {
          controlsRef.current.target.copy(target);
          controlsRef.current.update();
        }
      },
    }, 0);

    const baseFov = cameraPositionStore.selectedCameraPosition.fov;
    const fovBoost = uiStore.isMobile ? (uiStore.isFullscreen ? 40 : 15) : 0;
    const targetFov = baseFov + fovBoost;

    timeline.to(camera, {
      fov: targetFov,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.updateProjectionMatrix();
      }
    }, 0);

    tweenRef.current = timeline;

  }, [cameraPositionStore.selectedCameraPositionName, uiStore.isMobile, uiStore.isFullscreen]);


  return <OrbitControls ref={controlsRef} makeDefault enabled={false} />;
});
