import { observer } from "mobx-react-lite";

interface SampleSummaryProps {
    samples: Array<{
        id: string;
        name: string;
        className: string;
        sample_previewUrl: string;
    }>;
    totalPrice: number;
}

export const SampleSummary = observer(({ samples, totalPrice }: SampleSummaryProps) => {
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

            <h3 className="summary-header">SAMPLES SELECTED</h3>

            <div className="sample-summary-grid">
                {samples.map((sample) => (
                    <div key={sample.id} className="sample-summary-item">
                        <div className="sample-summary-image">
                            <img src={sample.sample_previewUrl} alt={sample.name} />
                        </div>
                        <div className="sample-summary-info">
                            <div className="sample-summary-name">{sample.name}</div>
                            <div className="sample-summary-category">({sample.className})</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="summary-footer">
                <div className="summary-price-row">
                    <span className="summary-price-label">Sample Cost</span>
                    <span className="summary-price-value">£{totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-total-row">
                    <span className="summary-total-label">Total</span>
                    <span className="summary-total-value">£{totalPrice.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
});
