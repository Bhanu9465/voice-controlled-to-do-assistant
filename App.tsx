import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { useAppContext } from './hooks/useAppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import { AchievementToast } from './components/AchievementToast';

const AppContent: React.FC = () => {
    const { settings } = useAppContext();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    React.useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(settings.theme);
    }, [settings.theme]);

    return (
        <div className={`flex h-screen bg-background text-foreground font-sans antialiased ${settings.highContrast ? 'high-contrast' : ''}`} style={{ fontSize: `${settings.fontSize}px` }}>
            <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <main className="flex-1 flex flex-col overflow-hidden">
                <Header isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <Dashboard />
                </div>
            </main>
            <AchievementToast />
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;