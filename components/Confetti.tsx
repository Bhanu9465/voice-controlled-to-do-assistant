import React from 'react';

const CONFETTI_COUNT = 150;

export const Confetti: React.FC = () => {
    const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
        const style = {
            left: `${Math.random() * 100}%`,
            animation: `fall ${Math.random() * 2 + 3}s ${Math.random() * 4}s linear infinite`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
        };
        const sizeClass = i % 3 === 0 ? 'w-2 h-4' : (i % 3 === 1 ? 'w-3 h-3 rounded-full' : 'w-2 h-2');
        return <div key={i} className={`absolute top-[-20px] ${sizeClass}`} style={style}></div>;
    });

    return (
        <>
            <style>
                {`
                @keyframes fall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                    }
                }
                `}
            </style>
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-50">
                {confetti}
            </div>
        </>
    );
};
