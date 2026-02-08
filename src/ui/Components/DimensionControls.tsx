import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";
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

      <div className="dimension-info-box">
        <div className="info-icon">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
        </div>
        <p>All table heights are fixed between <strong>730mm to 750mm</strong></p>
      </div>

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

      <h3 className="panel-title" style={{ marginTop: '20px' }}>Wear It With</h3>
    </div>
  );
});
