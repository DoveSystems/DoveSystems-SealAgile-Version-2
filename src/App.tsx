import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import SprintPlanning from './pages/SprintPlanning';
import Backlog from './pages/Backlog';
import Velocity from './pages/Velocity';
import Capacity from './pages/Capacity';
import TeamSettings from './pages/TeamSettings';

// Components
import Layout from './components/Layout';
import { useUser } from './contexts/UserContext';

function App() {
  const location = useLocation();
  const { user } = useUser();

  // Redirect to welcome if no user is set
  const RequireUser = ({ children }: { children: JSX.Element }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Welcome />} />
        
        <Route path="/" element={
          <RequireUser>
            <Layout />
          </RequireUser>
        }>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="sprint-planning" element={<SprintPlanning />} />
          <Route path="backlog" element={<Backlog />} />
          <Route path="velocity" element={<Velocity />} />
          <Route path="capacity" element={<Capacity />} />
          <Route path="team-settings" element={<TeamSettings />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
