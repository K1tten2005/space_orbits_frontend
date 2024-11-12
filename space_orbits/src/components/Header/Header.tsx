import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header>
            <Link to="/orbits" className="orbit-link">
                <div className="logo">
                    <img src="http://127.0.0.1:9000/orbits/logo.png" alt="Логотип Космоорбит" />
                    <h1>Космоорбит</h1>
                </div>
            </Link>
        </header>
    );
};

export default Header;