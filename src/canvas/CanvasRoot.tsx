import { Canvas } from "@react-three/fiber";
import { BaseModel } from "./BaseModel";
import { TopModel } from "./TopModel";
import { ContactShadows } from "@react-three/drei";
import * as THREE from 'three';
import { CameraSetup } from "./Camera";
import { ChairModel } from "./ChairModel";
import { observer } from "mobx-react-lite";


export const CanvasRoot = observer(() => {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ fov: 75 }}
      gl={{
        outputColorSpace: THREE.SRGBColorSpace,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1
      }}>
      <CameraSetup />
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[5, 5, -5]}
        intensity={1.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={20}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.001}
      />

      <spotLight
        position={[-3, 6, 2]}
        angle={0.45}
        penumbra={0.8}
        intensity={50}
        castShadow
      />

      <pointLight
        position={[1, 0, 2]}
        intensity={20}
        color="#ffffff"
        distance={15}
      />

      <BaseModel />
      <TopModel />
      <ChairModel />

      <ContactShadows
        position={[0, 0, 0]}
        scale={10}
        blur={0.5}
        far={1}
        opacity={0.5}
      />

    </Canvas>
  );
});