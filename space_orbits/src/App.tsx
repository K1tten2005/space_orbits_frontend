import React from 'react';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import OrbitPage from './pages/OrbitPage/OrbitPage';
import OrbitsPage from './pages/OrbitsPage/OrbitsPage';
import { ROUTES } from "./Routes";
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ForbiddenPage from './pages/ForbiddenPage/ForbiddenPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import TransitionPage from './pages/TransitionPage/TransitionPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import BasicNavbar from './components/Navbar/Navbar';
import TransitionsPage from './pages/TransitionsPage/TransitionsPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
    return (
        <BrowserRouter basename='/space_orbits_frontend'>
            <BasicNavbar />
            <Routes>
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.ORBITS} element={<OrbitsPage />} />
                <Route path={`${ROUTES.ORBITS}/:id`} element={<OrbitPage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
                <Route path={ROUTES.PAGE403} element={<ForbiddenPage />} />
                <Route path={ROUTES.PAGE404} element={<NotFoundPage />} />
                <Route path={`${ROUTES.TRANSITIONS}/:id`} element={<TransitionPage />} />
                <Route path={ROUTES.TRANSITIONS} element={<TransitionsPage />} />
                <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;