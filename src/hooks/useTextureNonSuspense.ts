import { useEffect, useState, useRef } from "react";
import * as THREE from "three";

type TextureMap = { [key: string]: string };

// Global cache to store loaded textures (or promises if we wanted more complex dedup, but simple texture ref is enough)
const textureCache: Record<string, THREE.Texture> = {};

export const useTextureNonSuspense = (urls: TextureMap) => {
    // Check if all requested textures are already in cache
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
        // If we already have textures from initial state (cached), and the request matches, we might not need to do anything.
        // BUT if props change to NEW urls, we need to load them.
        // The `useState` initializer only runs on mount. 
        // So we need to handle updates.

        const requestId = JSON.stringify(urls);
        if (currentRequest.current === requestId) return; // Dedupe
        currentRequest.current = requestId;

        // Check cache again for this new request
        const allCachedNow = Object.values(urls).every(url => textureCache[url]);

        if (allCachedNow) {
            // Immediate update if cached
            const loaded: Record<string, THREE.Texture> = {};
            Object.keys(urls).forEach(key => {
                loaded[key] = textureCache[urls[key]];
            });
            setTextures(loaded);
            setLoading(false);
            return;
        }

        setLoading(true);

        const loader = new THREE.TextureLoader();

        const loadTexture = (url: string): Promise<THREE.Texture> => {
            // Check cache first
            if (textureCache[url]) return Promise.resolve(textureCache[url]);

            return new Promise((resolve, reject) => {
                loader.load(
                    url,
                    (texture) => {
                        textureCache[url] = texture; // Save to cache
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

                    // Apply common settings immediately
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
            // Optional: cleanup invalidation if needed, but for now we keep cache
        };
    }, [JSON.stringify(urls)]);

    return { textures, loading };
};
