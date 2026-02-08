import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";

export const Summary = observer(() => {
    const { topShapeStore, baseStore, chairStore, dimensionsStore, topColorStore } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const isCheckoutPage = location.pathname === '/checkout';

    const tablePrice = 2100;
    const chairPrice = 100;
    const totalChairPrice = chairStore.count * chairPrice;
    const totalPrice = tablePrice + totalChairPrice;

    return (

        <div className="summary-container">
            <div className="summary-branding">
                <h2 className="brand-logo">BeMade<sup className="tm">TM</sup></h2>
                <div className="brand-motto">
                    <span>YOUR DESIGN</span>
                    <span className="separator">|</span>
                    <span>OUR PERFECTION</span>
                </div>
                <hr className="brand-divider" />
            </div>

            <h3 className="summary-header">Your Build</h3>

            <div className="summary-row">
                <span className="summary-label">Table Top</span>
                <span className="summary-value">{topColorStore.selectedTopColor.name}</span>
            </div>

            <div className="summary-row">
                <span className="summary-label">Base</span>
                <span className="summary-value">{baseStore.selectedBase.name}</span>
            </div>

            <div className="summary-row">
                <span className="summary-label">Base Colour</span>
                <span className="summary-value">{baseStore.selectedBaseColor.name}</span>
            </div>

            <div className="summary-row">
                <span className="summary-label">Dimensions</span>
                <span className="summary-value">
                    {["round", "roundCircle", "square"].includes(topShapeStore.selectedTopShape.id)
                        ? `Diameter: ${dimensionsStore.length} mm`
                        : `Length: ${dimensionsStore.length} mm × Width: ${dimensionsStore.width} mm`
                    }
                </span>
            </div>

            <div className="summary-row">
                <span className="summary-label">Table Top Shape</span>
                <span className="summary-value">{topShapeStore.selectedTopShape.name}</span>
            </div>

            <div className="summary-row">
                <span className="summary-label">Chair Type</span>
                <span className="summary-value">{chairStore.count > 0 ? chairStore.selectedChair.name : "N/A"}</span>
            </div>

            <div className="summary-row">
                <span className="summary-label">Chair Colour</span>
                <span className="summary-value">{chairStore.count > 0 ? chairStore.selectedColor.name : "N/A"}</span>
            </div>

            <div className="summary-row" style={{ borderBottom: 'none' }}>
                <span className="summary-label">Chair Quantity</span>
                <span className="summary-value">{chairStore.count}</span>
            </div>

            <div className="summary-footer">
                <div className="summary-price-row">
                    <span className="summary-price-label">Dining Table</span>
                    <span className="summary-price-value">£{tablePrice.toFixed(2)}</span>
                </div>
                {chairStore.count > 0 && (
                    <div className="summary-price-row">
                        <span className="summary-price-label">{chairStore.count} x Chairs</span>
                        <span className="summary-price-value">£{totalChairPrice.toFixed(2)}</span>
                    </div>
                )}
                <div className="summary-total-row">
                    <span className="summary-total-label">Total</span>
                    <span className="summary-total-value">£{totalPrice.toFixed(2)}</span>
                </div>
            </div>

            {!isCheckoutPage && (
                <>
                    <div className="delivery-card">
                        <h4 className="delivery-title">Estimated Delivery:</h4>
                        <p className="delivery-text">
                            Our products are all unique, made to order and this takes some time in our factory.
                        </p>
                        <p className="delivery-text">
                            Once your order has been made, we will notify and arrange delivery with you.
                            Currently the estimated delivery times are within <strong>14–21 days.</strong>
                        </p>
                    </div>

                    <button
                        className="place-order-btn"
                        onClick={() => navigate('/checkout')}
                    >
                        PLACE ORDER
                    </button>
                </>
            )}
        </div>
    );
});
