import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import topColorsData from "../data/topColors.json";

interface SampleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface TopColor {
    id: string;
    name: string;
    className: string;
    sample_previewUrl: string;
    previewUrl?: string;
}

export const SampleModal = ({ isOpen, onClose }: SampleModalProps) => {
    const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    const topColors = topColorsData as TopColor[];

    // Group colors by className
    const groupedColors = useMemo(() => {
        const groups: Record<string, TopColor[]> = {};
        topColors.forEach((color) => {
            if (!groups[color.className]) {
                groups[color.className] = [];
            }
            groups[color.className].push(color);
        });
        return groups;
    }, [topColors]);

    // Calculate price based on selection
    const calculatePrice = (count: number): number => {
        if (count === 0) return 0;
        if (count <= 2) return 20;
        // For more than 2: £20 for every additional pair (or single)
        const additionalPairs = Math.ceil((count - 2) / 2);
        return 20 + (additionalPairs * 20);
    };

    const toggleSample = (id: string) => {
        const newSelected = new Set(selectedSamples);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedSamples(newSelected);
    };

    const handleBuyNow = () => {
        const selectedColors = topColors.filter(color => selectedSamples.has(color.id));
        const totalPrice = calculatePrice(selectedSamples.size);

        // Navigate to checkout with sample data
        navigate('/checkout', {
            state: {
                isSampleOrder: true,
                samples: selectedColors,
                totalPrice: totalPrice
            }
        });

        onClose();
    };

    const totalPrice = calculatePrice(selectedSamples.size);

    if (!isOpen) return null;

    return (
        <div className="sample-overlay" onClick={onClose}>
            <div className="sample-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sample-header">
                    <h3>Order Samples</h3>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="sample-content">
                    <div className="sample-pricing">
                        <h4>Sample Pricing</h4>
                        <ul>
                            <li>A pair of samples costs £20.</li>
                            <li>Ordering just one sample is also £20.</li>
                            <li>For more than two samples, it costs £20 for every additional pair. A single extra sample also counts as a full pair.</li>
                            <li>Please select your samples below:</li>
                        </ul>
                    </div>

                    {Object.entries(groupedColors).map(([className, colors]) => (
                        <div key={className} className="sample-category">
                            <h4 className="sample-category-title">{className}</h4>
                            <div className="sample-grid">
                                {colors.map((color) => (
                                    <div
                                        key={color.id}
                                        className={`sample-item ${selectedSamples.has(color.id) ? 'selected' : ''}`}
                                        onClick={() => toggleSample(color.id)}
                                    >
                                        <div className="sample-image-wrapper">
                                            <img
                                                src={color.sample_previewUrl}
                                                alt={color.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = color.previewUrl || '';
                                                }}
                                            />
                                            {selectedSamples.has(color.id) && (
                                                <div className="sample-checkmark">✓</div>
                                            )}
                                        </div>
                                        <span className="sample-name">{color.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sample-footer">
                    <div className="sample-total">
                        <span className="sample-count">
                            {selectedSamples.size} sample{selectedSamples.size !== 1 ? 's' : ''} selected
                        </span>
                        <span className="sample-price">£{totalPrice.toFixed(2)}</span>
                    </div>
                    <button
                        className="sample-buy-btn"
                        disabled={selectedSamples.size === 0}
                        onClick={handleBuyNow}
                    >
                        Buy Now →
                    </button>
                </div>
            </div>
        </div>
    );
};

