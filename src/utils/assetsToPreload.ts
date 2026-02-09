import chairData from "../data/chairData.json";
import baseShapes from "../data/baseShapes.json";
import topShapes from "../data/topShapes.json";

export const getAssetsToPreload = () => {
    const images: string[] = [
        "assets/header_logo.svg",
        "assets/background/background.svg",
        "/assets/selection-icon.svg"
    ];

    // Base Shapes previews
    baseShapes.forEach(s => {
        if (s.previewUrl) images.push(s.previewUrl);
    });

    // Top Shapes previews
    topShapes.forEach(s => {
        if (s.previewUrl) images.push(s.previewUrl);
    });

    // Chair previews
    chairData.forEach(c => {
        if (c.previewUrl) images.push(c.previewUrl);
    });

    return Array.from(new Set(images.filter(Boolean)));
};
