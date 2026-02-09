import React from "react";
import "./CarouselDots.css";

interface CarouselDotsProps {
  count: number;
  current: number;
  onSelect: (idx: number) => void;
}

export const CarouselDots: React.FC<CarouselDotsProps> = ({
  count,
  current,
  onSelect,
}) => {
  if (count <= 1) return null;

  const prev = () => {
    onSelect(current === 0 ? count - 1 : current - 1);
  };

  const next = () => {
    onSelect(current === count - 1 ? 0 : current + 1);
  };

  return (
    <div className="carousel-dots-wrapper">
      <button
        className="carousel-arrow"
        onClick={prev}
        aria-label="Previous"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M15 18l-6-6 6-6"
            stroke="#888"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
        onClick={next}
        aria-label="Next"
      >
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M9 6l6 6-6 6"
            stroke="#888"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
