import "../../App.css";
import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";

export const Footer = observer(() => {

    const { topShapeStore, baseStore, chairStore, dimensionsStore, topColorStore } = useStore();

    return (
        <>
            <div className="footer">
                <div className="footer-item">
                    <label>Your Build</label>
                    <span>Dining Table</span>
                </div>
                <div className="footer-item">
                    <label>Table Top</label>
                    <span>{topColorStore.selectedTopColor.name}</span>
                </div>
                <div className="footer-item">
                    <label>Table Base</label>
                    <span>{baseStore.selectedBase.name}</span>
                </div>
                <div className="footer-item">
                    <label>Table Base Colour</label>
                    <span>{baseStore.selectedBaseColor.name}</span>
                </div>
                <div className="footer-item">
                    <label>Dimensions (mm)</label>
                    {topShapeStore.selectedTopShape.id === "roundCircle" || topShapeStore.selectedTopShape.id === "square" ? <span>{dimensionsStore.length}</span> : <span>{dimensionsStore.length}×{dimensionsStore.width}</span>}
                </div>
                <div className="footer-item">
                    <label>Table Top Shape</label>

                    <span>{topShapeStore.selectedTopShape.name}</span>
                </div>
                <div className="footer-item">
                    <label>Chair Style</label>
                    {chairStore.count == 0 ? <span>N/A</span> : <span>{chairStore.selectedChair.name}</span>}
                </div>
                <div className="footer-item">
                    <label>Chair Color</label>
                    {chairStore.count == 0 ? <span>N/A</span> : <span>{chairStore.selectedColor.name}</span>}
                </div>
            </div>

        </>
    );
});