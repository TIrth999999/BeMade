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

    // Determine the appropriate up vector based on the view
    const isTopView = cameraPositionStore.selectedCameraPositionName === "topView" ||
      cameraPositionStore.selectedCameraPositionName === "chairTopView";

    // For top view, we want the camera's "up" to point along the negative Z axis
    // This ensures the view is oriented with the front of the table at the bottom of the screen
    const targetUp = isTopView ? new THREE.Vector3(0, 0, -1) : new THREE.Vector3(0, 1, 0);

    // Create a dummy camera to calculate the target quaternion with the correct up vector
    const dummyCamera = new THREE.PerspectiveCamera();
    dummyCamera.position.set(pos[0], pos[1], pos[2]);
    dummyCamera.up.copy(targetUp);
    dummyCamera.lookAt(target);
    dummyCamera.updateMatrixWorld();

    // Store initial quaternion and up vector
    const startQuaternion = camera.quaternion.clone();
    const endQuaternion = dummyCamera.quaternion.clone();
    const startUp = camera.up.clone();

    // Create a timeline for concurrent animations
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

    // Animate position
    timeline.to(camera.position, {
      x: pos[0],
      y: pos[1],
      z: pos[2],
      duration: 1.2,
      ease: "power2.inOut",
    }, 0); // Start at time 0

    // Animate rotation using quaternion interpolation
    const rotationProxy = { t: 0 };
    timeline.to(rotationProxy, {
      t: 1,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        // Spherical linear interpolation (slerp) for smooth rotation
        camera.quaternion.slerpQuaternions(startQuaternion, endQuaternion, rotationProxy.t);

        // Interpolate the up vector as well
        camera.up.lerpVectors(startUp, targetUp, rotationProxy.t);

        // Update controls
        if (controlsRef.current) {
          controlsRef.current.target.copy(target);
          controlsRef.current.update();
        }
      },
    }, 0); // Start at time 0 (concurrent with position)

    tweenRef.current = timeline;

  }, [cameraPositionStore.selectedCameraPositionName]);


  return <OrbitControls ref={controlsRef} makeDefault enabled={false} />;
});
