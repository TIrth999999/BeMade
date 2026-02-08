import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export const CameraSetup = () => {

    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    useEffect(() => {
        const target = new THREE.Vector3(0, 0.5, 0);

        camera.position.set(0, 1, 2);
        camera.lookAt(target);

        controlsRef.current?.target.copy(target);
        controlsRef.current?.update();
    }, [camera]);

    return <OrbitControls ref={controlsRef} makeDefault />;
};
