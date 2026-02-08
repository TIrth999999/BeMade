import { BaseSelector } from "./Components/BaseSelector";
import { ColorSelector } from "./Components/ColorSelector";
import { TopShapeSelector } from "./Components/TopShapeSelector";
import { DimensionControls } from "./Components/DimensionControls";
import { TopColorSelector } from "./Components/TopColorSelector";
import { ChairSelector } from "./Components/ChairSelector";

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
