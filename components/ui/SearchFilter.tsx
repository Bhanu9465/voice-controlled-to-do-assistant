import React from 'react';
import { Search } from 'lucide-react';

interface SearchFilterProps {
    onSearchChange: (query: string) => void;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({ onSearchChange }) => {
    return (
        <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
                type="text"
                placeholder="Search tasks..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card/60 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
            />
        </div>
    );
};