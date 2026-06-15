// src/components/FuelingVisualization/CounterAnimation.tsx
import React, { useEffect, useState } from 'react';
import './CounterAnimation.css';

interface CounterAnimationProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}

const CounterAnimation: React.FC<CounterAnimationProps> = ({ 
  label, 
  value, 
  unit, 
  color 
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    // Плавная анимация счетчика
    const duration = 200;
    const steps = 10;
    const increment = (value - displayValue) / steps;
    let step = 0;

    const interval = setInterval(() => {
      if (step < steps) {
        setDisplayValue(prev => prev + increment);
        step++;
      } else {
        setDisplayValue(value);
        clearInterval(interval);
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [value]);

  const formattedValue = displayValue.toFixed(2);
  const [integerPart, decimalPart] = formattedValue.split('.');

  return (
    <div className="counter-animation" style={{ '--counter-color': color } as React.CSSProperties}>
      <div className="counter-label">{label}</div>
      <div className="counter-display">
        <span className="counter-integer">{integerPart}</span>
        <span className="counter-decimal">.{decimalPart}</span>
        <span className="counter-unit">{unit}</span>
      </div>
      <div className="counter-bar">
        <div className="counter-bar-fill" />
      </div>
    </div>
  );
};

export default CounterAnimation;
