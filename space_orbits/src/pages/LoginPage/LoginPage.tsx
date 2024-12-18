import { FC, useState } from 'react';
import './LoginPage.css';
import { ROUTES } from "../../Routes";
import { useNavigate } from 'react-router-dom';
import {handleLogin} from "../../store/slices/userSlice";
import { AppDispatch } from "../../store/store";
import { useDispatch } from 'react-redux';

export const LoginPage: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const result = await dispatch(handleLogin(data));
      if (result.type === 'login/fulfilled') {
        navigate(ROUTES.ORBITS);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  const handleRegisterClick = () => {
    navigate(ROUTES.REGISTER);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <h1 className="login-title">Авторизация</h1>
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="username">Логин</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="login-form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {error && <div className="error-message">Ошибка входа</div>}
            <button type="submit" className="login-button">
              Войти
            </button>
            <button
              type="button"
              className="login-button"
              onClick={handleRegisterClick}
            >
              Регистрация
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;