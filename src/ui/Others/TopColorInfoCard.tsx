import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";
import { useState } from "react";

export const TopColorInfoCard = observer(() => {
    const { topColorStore } = useStore();
    const [isExpanded, setIsExpanded] = useState(true);

    const selectedColor = topColorStore.selectedTopColor;

    if (!isExpanded) {
        return (
            <div className="info-card-collapsed" onClick={() => setIsExpanded(true)}>
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"></path></svg>
            </div>
        );
    }

    return (
        <div className="info-card-expanded">
            <div className="info-card-header">
                <h3 className="info-card-title">{selectedColor.name}</h3>
                <button className="info-card-close" onClick={() => setIsExpanded(false)}>
                    ×
                </button>
            </div>
            <div className="info-card-category">{selectedColor.className}</div>
            <p className="info-card-description">{selectedColor.description}</p>
        </div>
    );
});
