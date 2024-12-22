import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../modules/spaceOrbitsAPI'; // Импортируем метод из API

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        setError(''); // Очистка предыдущей ошибки
        const result = await loginUser(username, password);

        if (result.success) {
            console.log('Авторизация успешна');
            navigate('/orbits'); // Перенаправление на главную страницу
        } else {
            setError(result.message || 'Неправильный логин или пароль');
        }
    };

    return (
        <div className="login-page">
            <main className="login-main">
                <div className="login-form">
                    <h2>Авторизация</h2>
                    {error && <p className="error-message">{error}</p>}
                    <input
                        type="text"
                        placeholder="Логин"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Войти</button>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;
