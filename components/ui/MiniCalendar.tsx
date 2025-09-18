import React from 'react';

export const MiniCalendar: React.FC = () => {
    const today = new Date();
    const month = today.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = today.getDate();

    return (
        <div className="bg-card p-4 rounded-lg border border-border text-center w-full">
            <div className="text-xs font-bold text-red-500">{month}</div>
            <div className="text-3xl font-bold">{day}</div>
        </div>
    );
};
