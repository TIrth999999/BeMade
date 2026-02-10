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
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  const { cameraPositionStore, uiStore } = useStore();

  useEffect(() => {
  const target = new THREE.Vector3(0, 0.5, 0);
  const pos = cameraPositionStore.selectedCameraPosition.position;

  tweenRef.current?.kill();

  tweenRef.current = gsap.to(camera.position, {
    x: pos[0],
    y: pos[1],
    z: pos[2],
    duration: 1.2,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(target);
      controlsRef.current?.target.copy(target);
      controlsRef.current?.update();
    },
    onComplete: () => {

      if (cameraPositionStore.isScreenshotFlow) {

        requestAnimationFrame(() => {
          uiStore.requestScreenshot();
          cameraPositionStore.endScreenshotFlow();
        });
      }
    }
  });
}, [cameraPositionStore.selectedCameraPositionName]);


  return <OrbitControls ref={controlsRef} makeDefault enabled={false} />;
});
