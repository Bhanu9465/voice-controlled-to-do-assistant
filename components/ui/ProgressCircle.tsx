import React from 'react';

interface ProgressCircleProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
    progress,
    size = 80,
    strokeWidth = 8,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} className="-rotate-90">
            <circle
                className="text-muted"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                className="text-primary"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: 'stroke-dashoffset 0.35s' }}
            />
        </svg>
    );
};
