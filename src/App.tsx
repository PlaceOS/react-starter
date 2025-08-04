import { Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BootstrapPage from './BootstrapPage';
import SystemPage from './SystemPage';

function App() {
    const { isAuthenticated, loading } = useAuth()!;

    // While the library is initializing, you can show a global spinner
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            </div>
        );
    }
    return (
        <>
            <main>
                <Routes>
                    <Route path="/" element={<BootstrapPage />} />
                    {/* Conditionally render routes based on auth state */}
                    {isAuthenticated && (
                        <>
                            <Route path="/" element={<BootstrapPage />} />
                            <Route
                                path="/tabbed/:system_id"
                                element={<SystemPage />}
                            />
                        </>
                    )}
                    {/* You could add a catch-all or a "not found" page here */}
                </Routes>
            </main>
        </>
    );
}

export default App;
