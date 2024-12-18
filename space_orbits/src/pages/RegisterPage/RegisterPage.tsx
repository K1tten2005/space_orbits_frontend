import React, { useState } from 'react';
import './RegisterPage.css';
import { api } from "../../API";
import { ROUTES } from "../../Routes";
import { useNavigate } from "react-router-dom";

const RegisterPagePage: React.FC = () => {
  const [error, setError] = useState(false); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    repeat_password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validatePasswords = () => {
    if (formData.password !== formData.repeat_password) {
      setError(true);
      alert("Пароли не совпадают!");
      return false;
    }
    setError(false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) return;

    try {
      console.log("Sending registration data:", formData);
      await api.users.usersRegisterCreate({
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        password: formData.password
      });
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error("Ошибка при регистрации", error);
      setError(true);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-left">
          <h1 className="register-title">Регистрация</h1>
          {error && <div className="error-message">Ошибка в регистрации</div>}
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form-group">
              <label htmlFor="username">Логин</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={254}
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="first_name">Имя</label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="last_name">Фамилия</label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                maxLength={150}
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                maxLength={128}
              />
            </div>
            <div className="register-form-group">
              <label htmlFor="repeat_password">Повторите пароль</label>
              <input
                id="repeat_password"
                type="password"
                name="repeat_password"
                value={formData.repeat_password}
                onChange={handleChange}
                required
                maxLength={128}
              />
            </div>
            <button type="submit" className="register-button">Зарегистрироваться</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPagePage;