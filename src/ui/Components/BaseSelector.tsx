import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";

export const BaseSelector = observer(() => {
  const { baseStore } = useStore();

  return (
    <div className="panel-section">
      <h3 className="panel-title">Choose Base</h3>

      <div className="card-grid">
        {baseStore.baseShapes.map(b => (
          <div key={b.id}>
            <div

              className={`card ${baseStore.selectedBase.id === b.id ? "active" : ""
                }`}
              onClick={() => baseStore.setBase(b.id)}
            >
              <img src={b.previewUrl} alt={b.name} />

            </div>
            <span>{b.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
});
