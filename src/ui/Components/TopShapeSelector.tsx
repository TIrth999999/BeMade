import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";

export const TopShapeSelector = observer(() => {
  const { baseStore, topShapeStore } = useStore();

  return (
    <div className="panel-section">
      <h3 className="panel-title">Choose Table Top Shape</h3>

      <div className="card-grid">
        {baseStore.availableTopShapes.map(s => (
          <div key={s.id}>
            <div

              className={`card ${topShapeStore.selectedTopShape.id === s.id ? "active" : ""
                }`}
              onClick={() => topShapeStore.setTopShape(s.id)}
            >
              <img src={s.previewUrl} alt={s.name} />

            </div>
            <span>{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
