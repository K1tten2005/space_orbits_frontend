import { BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from './components/Header/Header';
import { HomePage } from './pages/HomePage/HomePage';
import OrbitPage from './pages/OrbitPage/OrbitPage';
import OrbitsPage from './pages/OrbitsPage/OrbitsPage';
import { ROUTES } from "./Routes";
import { useEffect } from "react";
import { dest_root } from '../target_config'

function App() {
    useEffect(() => {
        if (typeof window !== 'undefined' && (window as any).__TAURI__?.tauri) {
          const { invoke } = (window as any).__TAURI__.tauri;
          
          invoke('tauri', { cmd: 'create' })
            .then((response: any) => console.log(response))
            .catch((error: any) => console.log(error));
    
          return () => {
            invoke('tauri', { cmd: 'close' })
              .then((response: any) => console.log(response))
              .catch((error: any) => console.log(error));
          };
        }
      }, []);

    return (
        <BrowserRouter basename={dest_root}>
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