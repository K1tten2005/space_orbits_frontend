import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Header.css'; // Убедитесь, что этот файл есть
import '../Navbar/Navbar'; // Убедитесь, что стиль для Navbar корректный

const Header: React.FC = () => {
    return (
        <header>
            <Link to="/" className="orbit-link">
                <div className="logo">
                    <img src="http://127.0.0.1:9000/orbits/logo.png" alt="Логотип Космоорбит" />
                    <h1>Космоорбит</h1>
                </div>
            </Link>
            <div className="header-center">
                <Navbar expand="lg" className="navbar">
                    <Container>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto nav-links">
                                <Nav.Link as={Link} to="/orbits" className="nav-link">Орбиты</Nav.Link>
                                <Nav.Link as={Link} to="/login">Войти</Nav.Link>
                                <Nav.Link as={Link} to="/">Домой</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;