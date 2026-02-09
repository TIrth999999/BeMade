import { BaseSelector } from "./Components/BaseSelector";
import { ChairSelector } from "./Components/ChairSelector";
import { ColorSelector } from "./Components/ColorSelector";
import { DimensionControls } from "./Components/DimensionControls";
import { Summary } from "./Components/Summary";
import { TopColorSelector } from "./Components/TopColorSelector";
import { TopShapeSelector } from "./Components/TopShapeSelector";

type RightPanelProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<string>>;
};

export const RightPanel = ({ setActiveStep }: RightPanelProps) => {

  let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  const handleScroll = () => {
    const panel = document.querySelector(".right-panel");
    if (!panel) return;

    if (scrollTimeout) clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const sections = panel.querySelectorAll("div[id]");
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= panel.getBoundingClientRect().top + 50) {
          current = section.id;
        }
      });

      if (current) setActiveStep(current);
    }, 20);
  };


  return (
    <div className="right-panel" onScroll={handleScroll}>
      <div id="baseSelector"><BaseSelector /></div>
      <div id="colorSelector"><ColorSelector /></div>
      <div id="topColorSelector"><TopColorSelector /></div>
      <div id="topShapeSelector"><TopShapeSelector /></div>
      <div id="dimensionControls"><DimensionControls /></div>
      <div id="charirSelector"><ChairSelector /></div>
      <div id="summary"><Summary /></div>
    </div>
  );
};
