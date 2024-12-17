import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import OrbitPage from './pages/OrbitPage/OrbitPage';
import OrbitsPage from './pages/OrbitsPage/OrbitsPage';
import TransitionPage from './pages/TransitionPage/TransitionPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { ROUTES } from "./Routes";

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ORBITS} element={<OrbitsPage />} />
                <Route path={`${ROUTES.ORBITS}/:id`} element={<OrbitPage />} />
                <Route path={`${ROUTES.TRANSITIONS}/:id`} element={<TransitionPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            </Routes>
        </Router>
    );
};

export default App;