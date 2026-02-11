import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import topColorsData from "../../data/topColors.json";
import type { TopColor } from "../../types";
import { observer } from "mobx-react-lite";
import { useStore } from "../../context/StoreContext";

interface SampleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SampleItem = React.memo(({
    color,
    isSelected,
    onToggle
}: {
    color: TopColor;
    isSelected: boolean;
    onToggle: (id: string) => void;
}) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isMobile) return;

        const offset = 20;
        let x = e.clientX + offset;
        let y = e.clientY + offset;

        // Tooltip dimensions (approximate)
        const tooltipWidth = 320;
        const tooltipHeight = 600;

        if (x + tooltipWidth > window.innerWidth) {
            x = e.clientX - tooltipWidth - offset;
        }

        if (y + tooltipHeight > window.innerHeight) {
            y = window.innerHeight - tooltipHeight - offset;
        }

        setMousePos({ x, y });
    };

    return (
        <div
            className={`sample-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onToggle(color.id)}
            onMouseMove={handleMouseMove}
        >
            <div className="sample-image-wrapper">
                <img
                    src={color.previewUrl}
                    alt={color.name}
                    loading="lazy"
                    onError={(e) => {
                        e.currentTarget.src = color.previewUrl || '';
                    }}
                />
                {isSelected && (
                    <div className="sample-checkmark">
                        <img src="/assets/selection-icon.svg" alt="Selected" />
                    </div>
                )}
            </div>
            <span className="sample-name">{color.name}</span>

            {!isMobile && (
                <div
                    className="sample-hover-box"
                    style={{
                        position: 'fixed',
                        left: `${mousePos.x}px`,
                        top: `${mousePos.y}px`,
                        pointerEvents: 'none'
                    }}
                >
                    <img src={color.sample_previewUrl} alt={color.name} />
                    <div className="sample-hover-content">
                        <strong>{color.name}</strong>
                        <p>{color.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
});

SampleItem.displayName = 'SampleItem';

export const SampleModal = observer(({ isOpen, onClose }: SampleModalProps) => {
    const [selectedSamples, setSelectedSamples] = useState<Set<string>>(new Set());
    const navigate = useNavigate();
    const { uiStore } = useStore();

    const topColors = useMemo(() => topColorsData as TopColor[], []);

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

    const calculatePrice = useCallback((count: number): number => {
        if (count === 0) return 0;
        if (count <= 2) return 20;
        const additionalPairs = Math.ceil((count - 2) / 2);
        return 20 + (additionalPairs * 20);
    }, []);

    const toggleSample = useCallback((id: string) => {
        setSelectedSamples(prev => {
            const newSelected = new Set(prev);
            if (newSelected.has(id)) {
                newSelected.delete(id);
            } else {
                newSelected.add(id);
            }
            return newSelected;
        });
    }, []);

    const handleBuyNow = useCallback(() => {
        if (!uiStore.isLoggedIn) {
            navigate("/login");
            onClose();
            return;
        }

        const selectedColors = topColors.filter(color => selectedSamples.has(color.id));
        const totalPrice = calculatePrice(selectedSamples.size);
        navigate('/checkout', {
            state: {
                isSampleOrder: true,
                samples: selectedColors,
                totalPrice: totalPrice
            }
        });

        onClose();
    }, [selectedSamples, topColors, calculatePrice, navigate, onClose, uiStore.isLoggedIn]);

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
                                    <SampleItem
                                        key={color.id}
                                        color={color}
                                        isSelected={selectedSamples.has(color.id)}
                                        onToggle={toggleSample}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="sample-footer">
                    <div className="sample-total">
                    </div>
                    <button
                        className="sample-buy-btn"
                        disabled={selectedSamples.size === 0}
                        onClick={handleBuyNow}
                    >
                        Buy Now  <i className="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
});

