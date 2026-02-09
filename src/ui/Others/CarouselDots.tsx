import React from "react";
import "./CarouselDots.css";

interface CarouselDotsProps {
  count: number;
  current: number;
  onSelect: (idx: number) => void;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({ count, current, onSelect }) => {
  if (count <= 1) return null;
  return (
    <div className="carousel-dots-wrapper">
      <button
        className="carousel-arrow"
        onClick={() => onSelect(Math.max(current - 1, 0))}
        aria-label="Previous"
        disabled={current === 0}
      >
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <div className="carousel-dots">
        {Array.from({ length: count }).map((_, idx) => (
          <button
            key={idx}
            className={`carousel-dot${idx === current ? " active" : ""}`}
            onClick={() => onSelect(idx)}
            aria-label={`Go to item ${idx + 1}`}
          />
        ))}
      </div>
      <button
        className="carousel-arrow"
        onClick={() => onSelect(Math.min(current + 1, count - 1))}
        aria-label="Next"
        disabled={current === count - 1}
      >
        <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#888" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
};
