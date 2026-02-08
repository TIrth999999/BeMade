import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";

export const LoadingOverlay = observer(() => {
    const { uiStore } = useStore();

    if (!uiStore.isCanvasLoading) return null;

    return (
        <div className="loading-overlay">
            <div className="loader-box">
                <div className="custom-arc-spinner"></div>
            </div>
        </div>
    );
});