import { observer } from "mobx-react-lite";
import '../../App.css';
import { useStore } from "../../context/StoreContext";
import { useState } from "react";
import { TableSeatingModal } from "../Modals/TableSeatingModal";

export const ChairSelector = observer(() => {
    const { chairStore, cameraPositionStore, dimensionsStore, topShapeStore } = useStore();

    const isUniform = topShapeStore.selectedTopShape.defaultLength === topShapeStore.selectedTopShape.defaultWidth;
    const maxLimit = chairStore.maxChairs;
    const isMaxReached = chairStore.count >= maxLimit;

    const [isTableSeatingModalOpen, setisTableSeatingModalOpen] = useState(false);

    const rectangleTable = [
        { length: 1200, tight: 6, comfort: 4 },
        { length: 1300, tight: 6, comfort: 4 },
        { length: 1400, tight: 6, comfort: 4 },
        { length: 1500, tight: 6, comfort: 6 },
        { length: 1600, tight: 6, comfort: 6 },
        { length: 1700, tight: 8, comfort: 6 },
        { length: 1800, tight: 8, comfort: 6 },
        { length: 1900, tight: 8, comfort: 8 },
        { length: 2000, tight: 8, comfort: 8 },
        { length: 2100, tight: 8, comfort: 8 },
        { length: 2200, tight: 8, comfort: 8 },
        { length: 2300, tight: 8, comfort: 8 },
        { length: 2400, tight: 10, comfort: 8 },
        { length: 2500, tight: 10, comfort: 8 },
        { length: 2600, tight: 10, comfort: 10 },
        { length: 2700, tight: 10, comfort: 10 },
        { length: 2800, tight: 10, comfort: 10 },
        { length: 2900, tight: 10, comfort: 10 },
        { length: 3000, tight: 12, comfort: 10 },
        { length: 3100, tight: 12, comfort: 12 },
        { length: 3180, tight: 12, comfort: 12 },
    ];

    const roundTable = [
        { diameter: 1200, tight: 6, comfort: 6 },
        { diameter: 1300, tight: 6, comfort: 6 },
        { diameter: 1400, tight: 7, comfort: 6 },
        { diameter: 1500, tight: 7, comfort: 7 },
        { diameter: 1580, tight: 8, comfort: 8 },
    ];

    const squareTable = [
        { size: 1200, tight: 6, comfort: 6 },
        { size: 1300, tight: 6, comfort: 6 },
        { size: 1400, tight: 6, comfort: 6 },
        { size: 1500, tight: 8, comfort: 8 },
        { size: 1580, tight: 8, comfort: 8 },
    ];

    function getSeatingType(length: number, width: number, isUniform: boolean) {
        if (chairStore.count === 0) return null;
        if (isUniform) {

            if (length === width) {
                const entry = squareTable.find(e => e.size === length);
                if (!entry) return null;
                if (chairStore.count <= entry.comfort) return "Comfortable Seating";
                if (chairStore.count >= entry.tight) return "Compact Seating";
            }

            const entry = roundTable.find(e => e.diameter === length);
            if (!entry) return null;
            if (chairStore.count <= entry.comfort) return "Comfortable Seating";
            if (chairStore.count >= entry.tight) return "Compact Seating";
        } else {

            const entry = rectangleTable.find(e => e.length === length);
            if (!entry) return null;
            if (chairStore.count <= entry.comfort) return "Comfortable Seating";
            if (chairStore.count >= entry.tight) return "Compact Seating";
        }
        return null;
    }

    const seatingType = getSeatingType(dimensionsStore.length, dimensionsStore.width, isUniform);

    return (

        <div className="panel-section">

            <h3 className="panel-title">Wear It With</h3>
            {seatingType && (
                <div className="seating-type-info">
                    <span>{seatingType}</span>
                </div>
            )}
            <br>
            </br>
            <div className="card-grid">
                {chairStore.chairs.map(c => (
                    <div key={c.id}>
                        <div
                            className={`card ${chairStore.selectedChair.id === c.id ? "active" : ""}`}
                            onClick={() => chairStore.setChair(c.id)}
                        >
                            <img src={c.previewUrl} alt={c.name} />
                        </div>
                        <span>{c.name}</span>
                    </div>
                ))}
            </div>

            <div className="color-section" style={{ marginTop: '32px' }}>
                <h3 className="panel-title" style={{ fontSize: '20px', marginBottom: '16px' }}>Select Chair Color</h3>
                <div className="color-grid-circular">
                    {chairStore.availableColors.map((color) => (
                        <div
                            key={color.id}
                            className={`color-swatch-circular ${chairStore.selectedColor.id === color.id ? "active" : ""}`}
                            onClick={() => chairStore.setChairColor(color.id)}
                        >
                            <img src={color.previewUrl} alt={color.name} title={color.name} />
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <h3 className="panel-title" style={{ fontSize: '18px', margin: 0 }}>Select Chair Quantity</h3>
                        <div className="info-icon-tooltip" onClick={() => setisTableSeatingModalOpen(true)}>
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#000000',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                                i
                            </div>
                            <span className="tooltip-text" >Table Seating Info</span>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #d1d5db',
                        width: 'fit-content'
                    }}>
                        <button
                            onClick={() => {
                                chairStore.count > 0 && chairStore.setCount(chairStore.count - 2);
                                if (chairStore.count - 2 <= 0) {
                                    cameraPositionStore.setCameraPosition("frontView")
                                }
                            }}
                            disabled={chairStore.count <= 0}
                            style={{
                                width: '48px',
                                height: '36px',
                                border: 'none',
                                background: chairStore.count <= 0 ? '#e5e7eb' : '#9ca3af',
                                color: 'white',
                                fontSize: '20px',
                                cursor: chairStore.count <= 0 ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            −
                        </button>
                        <div style={{
                            width: '60px',
                            height: '36px',
                            background: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            fontWeight: '600',
                            borderLeft: '1px solid #d1d5db',
                            borderRight: '1px solid #d1d5db'
                        }}>
                            {chairStore.count}
                        </div>
                        <button
                            onClick={() => {
                                !isMaxReached && chairStore.setCount(chairStore.count + 2);
                                cameraPositionStore.setCameraPosition("chairView")
                            }}
                            disabled={isMaxReached}
                            style={{
                                width: '48px',
                                height: '36px',
                                border: 'none',
                                background: isMaxReached ? '#e5e7eb' : 'black',
                                color: 'white',
                                fontSize: '20px',
                                cursor: isMaxReached ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            <TableSeatingModal
                isOpen={isTableSeatingModalOpen}
                onClose={() => setisTableSeatingModalOpen(false)}
            />
        </div>
    );
});
