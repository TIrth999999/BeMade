import { BaseSelector } from "./Components/BaseSelector";
import { useEffect } from "react";
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStep(entry.target.id);
          }
        });
      },
      {
        root: document.querySelector(".right-panel"),
        threshold: 0.6,
      }
    );

    const panel = document.querySelector(".right-panel");
    if (panel) {
      const sections = panel.querySelectorAll("div[id]");
      sections.forEach((section) => observer.observe(section));
    }

    return () => observer.disconnect();
  }, [setActiveStep]);


  return (
    <div className="right-panel">
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
