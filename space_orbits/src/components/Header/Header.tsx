import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import './Header.css';
import '../Navbar/Navbar';

const Header: React.FC = () => {



    
    return (
        <header>
            <Link to="/" className="orbit-link">
                <div className="logo">
                    <img src="./logo.png" alt="Логотип Космоорбит" />
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
                                <Nav.Link as={Link} to="/login" className="nav-link">Войти</Nav.Link>
                                <Nav.Link as={Link} to="/profile" className="nav-link">Профиль</Nav.Link>
                                <Nav.Link as={Link} to="/logout" className="nav-link">Выйти</Nav.Link>
                                <Nav.Link as={Link} to="/register" className="nav-link">Регистрация</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;