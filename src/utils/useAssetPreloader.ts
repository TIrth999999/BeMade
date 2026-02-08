import { useState, useEffect } from 'react';


export const useAssetPreloader = (imageUrls: string[]) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);

    useEffect(() => {
        if (!imageUrls || imageUrls.length === 0) {
            setImagesLoaded(true);
            return;
        }

        let loadedCount = 0;
        const total = imageUrls.length;

        const handleLoad = () => {
            loadedCount++;
            if (loadedCount === total) {
                setImagesLoaded(true);
            }
        };

        const handleError = (url: string) => {
            console.error(`Failed to load image: ${url}`);
            loadedCount++;
            if (loadedCount === total) {
                setImagesLoaded(true);
            }
        };

        const imageObjects = imageUrls.map(url => {
            const img = new Image();
            img.src = url;
            img.onload = handleLoad;
            img.onerror = () => handleError(url);
            return img;
        });

        return () => {
            imageObjects.forEach(img => {
                img.onload = null;
                img.onerror = null;
            });
        };
    }, [imageUrls]);

    return { imagesLoaded };
};
