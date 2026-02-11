import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

type TextureMap = { [key: string]: string };

const textureCache: Record<string, THREE.Texture> = {};

export const useTextureNonSuspense = (urls: TextureMap) => {

    const allCached = Object.values(urls).every(url => textureCache[url]);

    const [textures, setTextures] = useState<Record<string, THREE.Texture> | null>(() => {
        if (allCached) {
            const loaded: Record<string, THREE.Texture> = {};
            Object.keys(urls).forEach(key => {
                loaded[key] = textureCache[urls[key]];
            });
            return loaded;
        }
        return null;
    });

    const [loading, setLoading] = useState(!allCached);

    const currentRequest = useRef<string | null>(null);

    useEffect(() => {

        const requestId = JSON.stringify(urls);
        if (currentRequest.current === requestId) return;
        currentRequest.current = requestId;

        const allCachedNow = Object.values(urls).every(url => textureCache[url]);

        if (allCachedNow) {
            const loaded: Record<string, THREE.Texture> = {};
            Object.keys(urls).forEach(key => {
                loaded[key] = textureCache[urls[key]];
            });
            setTextures(loaded);
            setLoading(false);
            return;
        }

        setTextures(null);
        setLoading(true);

        const loader = new THREE.TextureLoader();

        const loadTexture = (url: string): Promise<THREE.Texture> => {
            if (textureCache[url]) return Promise.resolve(textureCache[url]);

            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (texture) => {
                        textureCache[url] = texture;
                        resolve(texture);
                    },
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
        };
    }, [JSON.stringify(urls)]);

    return { textures, loading };
};
