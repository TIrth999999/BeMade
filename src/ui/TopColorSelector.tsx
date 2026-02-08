import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";

export const TopColorSelector = observer(() => {
  const { topColorStore } = useStore();

  const groups = topColorStore.colors.reduce((acc: any, color) => {
    const className = color.className || "Other";
    if (!acc[className]) acc[className] = [];
    acc[className].push(color);
    return acc;
  }, {});

  return (
    <div className="panel-section">
      <h3 className="panel-title">Choose Table Top</h3>

      {Object.entries(groups).map(([className, colors]: [string, any]) => (
        <div key={className} className="color-group">
          <div className="class-label">{className}</div>
          <div className="color-grid">
            {colors.map((c: any) => (
              <div key={c.id}>
                <div
                  className={`color-swatch ${topColorStore.selectedColorId === c.id ? "active" : ""
                    }`}
                  onClick={() => topColorStore.setColor(c.id)} >
                  <img src={c.previewUrl} alt={c.name} /> </div>
                <span className="color-name">{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

