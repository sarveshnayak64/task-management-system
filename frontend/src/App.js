import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [selectedProject, setSelectedProject] = useState(null);

    if (!isAuthenticated) {
        return <Auth />;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            {selectedProject ? (
                <ProjectDetail project={selectedProject} onBack={() => setSelectedProject(null)} />
            ) : (
                <ProjectList onSelectProject={setSelectedProject} />
            )}
        </div>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
