import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import OrbitPage from './pages/OrbitPage/OrbitPage';
import OrbitsPage from './pages/OrbitsPage/OrbitsPage';
import { ROUTES } from "./Routes";

const App: React.FC = () => {
    return (
        <BrowserRouter basename='/space_orbits_frontend'>
            <Header />
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ORBITS} element={<OrbitsPage />} />
                <Route path={`${ROUTES.ORBITS}/:id`} element={<OrbitPage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;