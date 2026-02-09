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
    const { cameraPositionStore } = useStore();

    useEffect(() => {
        const target = new THREE.Vector3(0, 0.5, 0);

        gsap.to(camera.position, {
            x: cameraPositionStore.selectedCameraPosition.position[0],
            y: cameraPositionStore.selectedCameraPosition.position[1],
            z: cameraPositionStore.selectedCameraPosition.position[2],
            duration: 1.2,
            ease: "power2.inOut",
            onUpdate: () => { camera.lookAt(target); }
        });

        // camera.position.set(cameraPositionStore.selectedCameraPosition.position[0], cameraPositionStore.selectedCameraPosition.position[1], cameraPositionStore.selectedCameraPosition.position[2]);
        camera.lookAt(target);

        controlsRef.current?.target.copy(target);
        controlsRef.current?.update();
    }, [camera, cameraPositionStore.selectedCameraPositionName]);

    return <OrbitControls ref={controlsRef} makeDefault enabled={false} />;
});