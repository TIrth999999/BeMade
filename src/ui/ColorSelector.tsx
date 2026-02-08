import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";

export const ColorSelector = observer(() => {
  const { baseStore, colorStore } = useStore();

  return (
    <div className="panel-section">
      <h3 className="panel-title">Choose Base Color</h3>

      <div className="color-grid">
        {baseStore.availableColors.map(c => (
<div key={c.id}>
          <div
            
            className={`color-swatch ${colorStore.selectedColorId === c.id ? "active" : ""
              }`}
            onClick={() => colorStore.setColor(c.id)}
          >          <img src={c.previewUrl} alt={c.name} /> </div>
             <span>{c.name}</span>
             </div>
        ))}
      </div>
   
    </div>
  );
});
