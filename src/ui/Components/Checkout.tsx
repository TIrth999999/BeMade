import { observer } from "mobx-react-lite";
import { Summary } from "./Summary";
import { SampleSummary } from "../Others/SampleSummary";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckoutNavbar } from "../Navbars/CheckoutNavbar";
import { useState } from "react";
import { TermsModal } from "../Modals/TermsModal";
import { useStore } from "../../context/StoreContext";

interface LocationState {
    isSampleOrder?: boolean;
    samples?: Array<{
        id: string;
        name: string;
        className: string;
        sample_previewUrl: string;
    }>;
    totalPrice?: number;
}

export const Checkout = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const state = location.state as LocationState;
    const isSampleOrder = state?.isSampleOrder || false;
    const samples = state?.samples || [];
    const sampleTotalPrice = state?.totalPrice || 0;

    const { uiStore } = useStore();

    const handleAcceptTerms = () => {
        setTermsAccepted(true);
        setIsTermsOpen(false);
    };

    return (
        <>
            <CheckoutNavbar />
            <div className="checkout-page">
                <div className="checkout-content">
                    <div className="checkout-left">
                        <h2 className="checkout-heading">Checkout</h2>

                        <form className="checkout-form">
                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label className="required">Full Name</label>
                                    <input type="text" placeholder="Enter full name" />
                                </div>
                                <div className="form-group full-width">
                                    <label className="required">Address Line 1</label>
                                    <input type="text" placeholder="Enter address line 1" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Address Line 2</label>
                                    <input type="text" placeholder="Enter address line 2 (optional)" />
                                </div>
                                <div className="form-group full-width">
                                    <label className="required">City</label>
                                    <input type="text" placeholder="Enter city" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label className="required">Postcode</label>
                                    <input type="text" placeholder="Enter postcode" />
                                </div>
                                <div className="form-group full-width">
                                    <label>County</label>
                                    <input type="text" placeholder="Enter county" />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label className="required">Phone Number</label>
                                    <input type="text" placeholder="Enter phone number" />
                                </div>
                                <div className="form-group full-width">
                                    <label className="required">Email Address</label>
                                    <input type="text" placeholder="Enter email address" />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="button"
                                    className="back-btn"
                                    onClick={() => {
                                        uiStore.resetScreenshot();
                                        navigate('/');
                                    }}
                                >
                                    <span className="arrow-left">‹</span> Back to Design
                                </button>

                                <div className="right-actions">
                                    <button
                                        type="button"
                                        className={`terms-btn ${termsAccepted ? 'accepted' : ''}`}
                                        onClick={() => setIsTermsOpen(true)}
                                    >
                                        Terms & Conditions {termsAccepted && <span className="checkmark">✓</span>}
                                    </button>
                                    <button
                                        type="button"
                                        className="pay-btn"
                                        disabled={!termsAccepted}
                                    >
                                        Pay Now &gt;
                                    </button>
                                </div>
                            </div>

                            <div className="important-notice">
                                <div className="notice-icon-header">
                                    <strong>IMPORTANT</strong>
                                </div>
                                <p>
                                    Due to the bespoke nature of your order, we can only provide 48 hours after placing your order, where you may cancel or make any changes before production process begins. After this point, cancellations and amendments will not be possible.
                                </p>
                            </div>
                        </form>
                    </div>

                    <div className="checkout-right">
                        {!isSampleOrder && (
                            <div className="checkout-preview-image">
                                {uiStore.canvasScreenshot ? (
                                    <img
                                        src={uiStore.canvasScreenshot}
                                        alt="Table Preview"
                                        style={{
                                            width: "100%",
                                            height: "240px",
                                            objectFit: "contain",
                                            borderRadius: "4px",
                                            background: 'url("./assets/background/background.svg") center center / cover no-repeat'
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            height: "240px",
                                            background: "linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)",
                                            borderRadius: "4px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#999"
                                        }}
                                    >
                                        No preview available
                                    </div>
                                )}
                            </div>

                        )}

                        <div className="checkout-summary-wrapper">
                            {isSampleOrder ? (
                                <SampleSummary samples={samples} totalPrice={sampleTotalPrice} />
                            ) : (
                                <Summary />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <TermsModal
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
                onAccept={handleAcceptTerms}
            />
        </>
    );
});

