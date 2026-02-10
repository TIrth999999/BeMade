import * as THREE from "three";
import { useEffect, useState } from "react";

export function useTopTextures(color: any) {
  const [textures, setTextures] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    const loader = new THREE.TextureLoader();

    setLoading(true);

    Promise.all([
      loader.loadAsync(color.baseUrl),
      loader.loadAsync(color.normalUrl),
      loader.loadAsync(color.roughnessUrl),
      loader.loadAsync(color.metalnessUrl),
    ]).then(([map, normal, roughness, metalness]) => {
      if (!alive) return;

      map.colorSpace = THREE.SRGBColorSpace;
      normal.colorSpace = THREE.LinearSRGBColorSpace;
      roughness.colorSpace = THREE.LinearSRGBColorSpace;
      metalness.colorSpace = THREE.LinearSRGBColorSpace;

      [map, normal, roughness, metalness].forEach(t => {
        t.wrapS = THREE.RepeatWrapping;
        t.wrapT = THREE.RepeatWrapping;
        t.flipY = false;
        t.anisotropy = 16;
      });

      setTextures({
        map,
        normalMap: normal,
        roughnessMap: roughness,
        metalnessMap: metalness,
      });

      setLoading(false);
    });

    return () => {
      alive = false;
    };
  }, [
    color.baseUrl,
    color.normalUrl,
    color.roughnessUrl,
    color.metalnessUrl,
  ]);

  return { textures, loading };
}
