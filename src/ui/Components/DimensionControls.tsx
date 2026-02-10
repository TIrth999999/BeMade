import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";
import { useEffect, useCallback } from "react";

const DimensionSlider = ({
  label,
  value,
  type,
  min,
  max,
  step,
  onUpdate
}: {
  label: string;
  value: number;
  type: "length" | "width";
  min: number;
  max: number;
  step: number;
  onUpdate: (type: "length" | "width", value: number, min: number, max: number, step: number) => void;
}) => (
  <div className="dimension-control">
    <span className="dimension-label">{label}</span>

    <div className="slider-container">
      <button
        className="slider-btn"
        onClick={() => onUpdate(type, value - step, min, max, step)}
      >
        −
      </button>

      <input
        type="range"
        className="custom-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) =>
          onUpdate(type, Number(e.target.value), min, max, step)
        }
      />

      <button
        className="slider-btn"
        onClick={() => onUpdate(type, value + step, min, max, step)}
      >
        +
      </button>
    </div>

    <span className="dimension-value">{value}mm</span>
  </div>
);

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

  const baseId = baseStore.selectedBase.id;

  if (baseId === "linea") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  } else if (baseId === "lineaDome") {
    lengthMin = 1580;
    lengthMax = 1580;
    widthMin = 1580;
    widthMax = 1580;
  } else if (baseId === "lineaContour") {
    lengthMin = 2000;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  } else if (baseId === "curva") {
    lengthMin = 1800;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  } else if (baseId === "cradle") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  } else if (baseId === "twiste") {
    lengthMin = 2200;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  } else if (baseId === "axis") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  } else if (baseId === "moon") {
    lengthMin = 1600;
    lengthMax = 3200;
    widthMin = 800;
    widthMax = 1300;
  }

  useEffect(() => {
    const currentLength = dimensionsStore.length;
    const currentWidth = dimensionsStore.width;
    let newLength = currentLength;
    let newWidth = currentWidth;
    let changed = false;

    if (currentLength < lengthMin || currentLength > lengthMax) {
      newLength = Math.max(lengthMin, Math.min(lengthMax, currentLength));
      changed = true;
    }

    if (!isUniform && (currentWidth < widthMin || currentWidth > widthMax)) {
      newWidth = Math.max(widthMin, Math.min(widthMax, currentWidth));
      changed = true;
    }

    if (isUniform && currentWidth !== currentLength) {
      newWidth = newLength;
      changed = true;
    }

    if (changed) {
      if (newLength !== currentLength) dimensionsStore.setLength(newLength);
      if (newWidth !== currentWidth) dimensionsStore.setWidth(newWidth);
    }

  }, [baseId, isUniform, lengthMin, lengthMax, widthMin, widthMax, dimensionsStore]);

  const handleUpdate = useCallback((
    type: "length" | "width",
    value: number,
    min: number,
    max: number,
    step: number
  ) => {
    const snapped = Math.round(value / step) * step;
    const clamped = Math.max(min, Math.min(max, snapped));

    if (type === "length") {
      dimensionsStore.setLength(clamped);
      if (isUniform) dimensionsStore.setWidth(clamped);
    } else {
      dimensionsStore.setWidth(clamped);
    }
  }, [dimensionsStore, isUniform]);

  return (
    <div className="panel-section">
      <h3 className="panel-title">Dimensions</h3>

      <div className="dimension-info-box">
        <div className="info-icon">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="14" width="14" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
        </div>
        <p>All table heights are fixed between <strong>730mm to 750mm</strong></p>
      </div>

      <DimensionSlider
        label={lengthLabel}
        value={dimensionsStore.length}
        type="length"
        min={lengthMin}
        max={lengthMax}
        step={100}
        onUpdate={handleUpdate}
      />

      {!isUniform &&
        <DimensionSlider
          label="Top Width"
          value={dimensionsStore.width}
          type="width"
          min={widthMin}
          max={widthMax}
          step={50}
          onUpdate={handleUpdate}
        />
      }

    </div>
  );
});
