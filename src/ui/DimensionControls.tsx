import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { useEffect } from "react";

export const DimensionControls = observer(() => {
  const { dimensionsStore, topShapeStore, baseStore } = useStore();
  const shape = topShapeStore.selectedTopShape;

  const isUniform = shape.defaultLength === shape.defaultWidth;

  let lengthMin = 1600;
  let lengthMax = 3180;
  let widthMin = 800;
  let widthMax = 1300;
  let lengthLabel = "Top Length";

  if (isUniform) {
    lengthMin = 1200;
    lengthMax = 1580;
    lengthLabel = "Top Diameter";
  }

  if (baseStore.selectedBase.id === "linea") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }

  if (baseStore.selectedBase.id === "lineaDome") {
    lengthMin = 1580;
    lengthMax = 1580;
    widthMin = 1580;
    widthMax = 1580;
  }


  if (baseStore.selectedBase.id === "lineaContour") {
    lengthMin = 2000;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }


  if (baseStore.selectedBase.id === "curva") {
    lengthMin = 1800;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }


  if (baseStore.selectedBase.id === "cradle") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }


  if (baseStore.selectedBase.id === "twiste") {
    lengthMin = 2200;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }


  if (baseStore.selectedBase.id === "axis") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }


  if (baseStore.selectedBase.id === "moon") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }

  useEffect(() => {
    const currentLength = dimensionsStore.length;
    const currentWidth = dimensionsStore.width;

    if (currentLength < lengthMin || currentLength > lengthMax) {
      const clampedLength = Math.max(lengthMin, Math.min(lengthMax, currentLength));
      dimensionsStore.setLength(clampedLength);
    }

    if (!isUniform && (currentWidth < widthMin || currentWidth > widthMax)) {
      const clampedWidth = Math.max(widthMin, Math.min(widthMax, currentWidth));
      dimensionsStore.setWidth(clampedWidth);
    }

    if (isUniform && currentWidth !== currentLength) {
      dimensionsStore.setWidth(currentLength);
    }
  }, [baseStore.selectedBase.id, isUniform, lengthMin, lengthMax, widthMin, widthMax]);

  const handleUpdate = (
    type: "length" | "width",
    value: number,
    min: number,
    max: number
  ) => {
    const snapped = Math.round(value / 100) * 100;
    const clamped = Math.max(min, Math.min(max, snapped));

    if (type === "length") {
      dimensionsStore.setLength(clamped);
      if (isUniform) dimensionsStore.setWidth(clamped);
    } else {
      dimensionsStore.setWidth(clamped);
    }
  };

  const renderSlider = (
    label: string,
    value: number,
    type: "length" | "width",
    min: number,
    max: number
  ) => (
    <div className="dimension-control">
      <span className="dimension-label">{label}</span>

      <div className="slider-container">
        <button
          className="slider-btn"
          onClick={() => handleUpdate(type, value - 100, min, max)}
        >
          −
        </button>

        <input
          type="range"
          className="custom-slider"
          min={min}
          max={max}
          step={100}
          value={value}
          onChange={(e) =>
            handleUpdate(type, Number(e.target.value), min, max)
          }
        />

        <button
          className="slider-btn"
          onClick={() => handleUpdate(type, value + 100, min, max)}
        >
          +
        </button>
      </div>

      <span className="dimension-value">{value}mm</span>
    </div>
  );

  return (
    <div className="panel-section">
      <h3 className="panel-title">Dimensions</h3>

      {renderSlider(
        lengthLabel,
        dimensionsStore.length,
        "length",
        lengthMin,
        lengthMax
      )}

      {!isUniform &&
        renderSlider(
          "Top Width",
          dimensionsStore.width,
          "width",
          widthMin,
          widthMax
        )}
    </div>
  );
});
