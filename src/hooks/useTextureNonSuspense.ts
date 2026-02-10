import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

type TextureMap = { [key: string]: string };

export const useTextureNonSuspense = (urls: TextureMap) => {
    const [textures, setTextures] = useState<Record<string, THREE.Texture> | null>(null);
    const [loading, setLoading] = useState(false);

    const currentRequest = useRef<string | null>(null);

    useEffect(() => {
        const loader = new THREE.TextureLoader();
        const requestId = JSON.stringify(urls);
        currentRequest.current = requestId;

        setLoading(true);

        const loadTexture = (url: string): Promise<THREE.Texture> => {
            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (texture) => resolve(texture),
                    undefined,
                    (err) => reject(err)
                );
            });
        };

        const loadAll = async () => {
            try {
                const keys = Object.keys(urls);
                const loaded: Record<string, THREE.Texture> = {};

                await Promise.all(keys.map(async (key) => {
                    const texture = await loadTexture(urls[key]);

                    texture.colorSpace = key === 'map' ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
                    texture.flipY = false;

                    loaded[key] = texture;
                }));

                if (currentRequest.current === requestId) {
                    setTextures(loaded);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error loading textures:", error);
                if (currentRequest.current === requestId) {
                    setLoading(false);
                }
            }
        };

        loadAll();

        return () => {
            currentRequest.current = null;
        };
    }, [JSON.stringify(urls)]);

    return { textures, loading };
};
