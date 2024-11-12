import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <Header />
            {/* Вставляем основной контент через children */}
            <main>
                {/* В реальном приложении здесь будет маршрутизация или динамическое наполнение */}
            </main>
        </div>
    );
};

export default App;

export default App
