import { observer } from "mobx-react-lite";
import { useStore } from "../context/StoreContext";
import { Summary } from "./Summary";

export const ChairSelector = observer(() => {
    const { chairStore } = useStore();

    // Use centralized max limit
    const maxLimit = chairStore.maxChairs;
    const isMaxReached = chairStore.count >= maxLimit;

    return (
        <div className="panel-section">
            <h3 className="panel-title">Choose Chair</h3>

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
                        <div style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            background: '#4b5563',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'help'
                        }} title={`Maximum ${maxLimit} chairs allowed based on shape and size`}>
                            i
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
                            onClick={() => chairStore.count > 0 && chairStore.setCount(chairStore.count - 2)}
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
                            onClick={() => !isMaxReached && chairStore.setCount(chairStore.count + 2)}
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

            <Summary />
        </div>
    );
});
