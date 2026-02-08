import { BaseSelector } from "./BaseSelector";
import { ColorSelector } from "./ColorSelector";
import { TopShapeSelector } from "./TopShapeSelector";
import { DimensionControls } from "./DimensionControls";
import { TopColorSelector } from "./TopColorSelector";
import { ChairSelector } from "./ChairSelector";

export const RightPanel = () => {
  return (
    <div className="right-panel">
      <BaseSelector />
      <ColorSelector />
      <TopColorSelector />
      <TopShapeSelector />
      <DimensionControls />
      <ChairSelector />
    </div>
  );
};
