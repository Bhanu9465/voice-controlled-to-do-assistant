import React from 'react';
import VoiceControlButton from './VoiceControlButton';
import { Sun, Moon, Menu } from 'lucide-react';
import { useAppContext } from '../hooks/useAppContext';
import { SearchFilter } from './ui/SearchFilter';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setIsSidebarOpen }) => {
    const { settings, setTheme, setSearchTerm } = useAppContext();

    const toggleTheme = () => {
        setTheme(settings.theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="flex-shrink-0 flex items-center justify-between h-16 px-4 md:px-8 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-20">
            <div className="flex items-center gap-2">
                 <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="md:hidden p-2 -ml-2 rounded-full hover:bg-muted"
                    aria-label="Open sidebar"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold hidden md:block">Dashboard</h1>
            </div>
            <div className="flex-1 max-w-lg mx-4">
                <SearchFilter onSearchChange={setSearchTerm} />
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-muted"
                    aria-label={`Switch to ${settings.theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                    {settings.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <VoiceControlButton />
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 items-center justify-center text-primary-foreground font-semibold hidden sm:flex">
                    <span>U</span>
                </div>
            </div>
        </header>
    );
};

export default Header;