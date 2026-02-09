import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const Summary = observer(() => {
    const { topShapeStore, baseStore, chairStore, dimensionsStore, topColorStore, uiStore } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const isCheckoutPage = location.pathname === '/checkout';
    useEffect(() => {
        if (uiStore.screenshotReady) {
            navigate("/checkout");
        }
    }, [uiStore.screenshotReady]);

    let tablePrice = 0;

    if (topShapeStore.selectedTopShapeId !== "roundCircle"
        && topShapeStore.selectedTopShapeId !== "square") {
        if (dimensionsStore.length >= 1600 && dimensionsStore.length <= 2200) {
            tablePrice = 2880;
        }
        else if (dimensionsStore.length >= 2250 && dimensionsStore.length <= 2450) {
            tablePrice = 3312;
        }
        else if (dimensionsStore.length >= 2500 && dimensionsStore.length <= 2850) {
            tablePrice = 3576;
        }
        else if (dimensionsStore.length >= 2900 && dimensionsStore.length <= 3200) {
            tablePrice = 3840;
        }
    }
    else if (topShapeStore.selectedTopShapeId === "roundCircle") {
        if (dimensionsStore.length == 1200) {
            tablePrice = 2290;
        }
        else if (dimensionsStore.length == 1300) {
            tablePrice = 2480;
        }
        else if (dimensionsStore.length == 1400) {
            tablePrice = 2750;
        }
        else if (dimensionsStore.length == 1500) {
            tablePrice = 2980;
        }
        else if (dimensionsStore.length >= 1580) {
            tablePrice = 2980;
        }
    }
    else if (topShapeStore.selectedTopShapeId === "square") {
        if (dimensionsStore.length == 1200) {
            tablePrice = 2190;
        }
        else if (dimensionsStore.length == 1300) {
            tablePrice = 2380;
        }
        else if (dimensionsStore.length == 1400) {
            tablePrice = 2650;
        }
        else if (dimensionsStore.length == 1500) {
            tablePrice = 2880;
        }
        else if (dimensionsStore.length >= 1580) {
            tablePrice = 2880;
        }
    }

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
                        onClick={() => {

                            uiStore.requestScreenshot()

                        }}
                    >
                        PLACE ORDER
                    </button>
                </>
            )}
        </div>
    );
});
