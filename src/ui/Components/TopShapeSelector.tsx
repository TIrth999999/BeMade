
import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";

export const TopShapeSelector = observer(() => {
  const { baseStore, topShapeStore, cameraPositionStore } = useStore();
  const allTopShapes = topShapeStore.topShapes;
  const allowedShapeIds = baseStore.selectedBase.topShapeIds;

  return (
    <div className="panel-section">
      <h3 className="panel-title">Choose Table Top Shape</h3>

      <div className="card-grid">
        {allTopShapes.map(s => {
          const isAllowed = allowedShapeIds.includes(s.id);
          const isActive = topShapeStore.selectedTopShape.id === s.id;
          return (
            <div key={s.id} style={{ opacity: isAllowed ? 1 : 0.4, pointerEvents: isAllowed ? 'auto' : 'none' }}>
              <div
                className={`card${isActive ? " active" : ""}${!isAllowed ? " disabled" : ""}`}
                onClick={isAllowed ? () => { topShapeStore.setTopShape(s.id); cameraPositionStore.setCameraPosition("topView") } : undefined}
                style={{ cursor: isAllowed ? "pointer" : "not-allowed" }}
              >
                <img src={s.previewUrl} alt={s.name} />
              </div>
              <span>{s.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
