import chairData from "../data/chairData.json";
import baseShapes from "../data/baseShapes.json";
import topShapes from "../data/topShapes.json";
import baseColors from "../data/baseColors.json";
import topColors from "../data/topColors.json";

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

    // Top Colors previews
    topColors.forEach(c => {
        if (c.previewUrl) images.push(c.previewUrl);
    });

    // Base Colors previews
    baseColors.forEach(c => {
        if (c.previewUrl) images.push(c.previewUrl);
    });

    // Filter out potential duplicates or undefined
    return Array.from(new Set(images.filter(Boolean)));
};
