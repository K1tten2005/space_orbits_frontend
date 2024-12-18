import { useAppDispatch, useAppSelector } from "../../store/store.ts";
import { FormEvent, useState, useEffect } from "react";
import { handleUpdateProfile, setValidationError } from "../../store/slices/userSlice.ts";
import './ProfilePage.css';

export const ProfilePage = () => {
  const { username = "", email = "", first_name = "", last_name = "", validation_error } = useAppSelector(
    (state) => state.user
  );

  const [inputUsername, setInputUsername] = useState(username);
  const [inputEmail, setInputEmail] = useState(email);
  const [inputPassword, setInputPassword] = useState("");
  const [input_first_name, setInput_first_name] = useState(first_name);
  const [input_last_name, setInput_last_name] = useState(last_name);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setValidationError(false));
  }, [inputUsername, inputEmail, inputPassword]);

  const handleSaveProfile = async (e: FormEvent) => {
    console.log("Validating");
    console.log(validation_error);
    dispatch(setValidationError(false));
    e.preventDefault();

    if (validation_error) {
      return;
    }

    const data = {
      username: inputUsername,
      email: inputEmail,
      password: inputPassword,
      first_name: input_first_name,
      last_name: input_last_name,
    };
    dispatch(handleUpdateProfile(data));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-left">
          <h1 className="profile-title">Профиль</h1>
          <form onSubmit={handleSaveProfile} className="profile-form">
            <div className="profile-form-group">
              <label htmlFor="username">Логин</label>
              <input
                id="username"
                type="text"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="email">Почта</label>
              <input
                id="email"
                type="email"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="first_name">Имя</label>
              <input
                id="first_name"
                type="text"
                value={input_first_name}
                onChange={(e) => setInput_first_name(e.target.value)}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="last_name">Фамилия</label>
              <input
                id="last_name"
                type="text"
                value={input_last_name}
                onChange={(e) => setInput_last_name(e.target.value)}
              />
            </div>

            <div className="profile-form-group">
              <label htmlFor="password">Пароль</label>
              <input
                id="password"
                type="password"
                placeholder="Введите новый пароль"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
              />
              {validation_error && (
                <div className="error-message">Введены некорректные данные</div>
              )}
            </div>

            <button type="submit" className="profile-button">Сохранить</button>
          </form>
        </div>
      </div>
    </div>
  );
};