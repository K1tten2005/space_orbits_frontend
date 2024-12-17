import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
    orbitHeight: string;
    setOrbitHeight: React.Dispatch<React.SetStateAction<string>>;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void; // Обработчик для клавиши Enter
    servicesCount: number; // Количество услуг в корзине
    isLoggedIn: boolean; // Статус авторизации
    draftTransitionId: number | null; // ID черновой заявки
}

const SearchBar: React.FC<SearchBarProps> = ({
    orbitHeight,
    setOrbitHeight,
    onKeyDown,
    servicesCount,
    isLoggedIn,
    draftTransitionId,
}) => {
    const handleCartClick = () => {
        if (draftTransitionId) {
            window.location.href = `/transitions/${draftTransitionId}/`; // Перенаправляем на страницу черновика
        }
    };

    return (
        <div className="search-cart-container">
            <form>
                <input
                    type="text"
                    placeholder="Поиск орбиты по высоте..."
                    value={orbitHeight}
                    onChange={(e) => setOrbitHeight(e.target.value)} // Обновляем состояние ввода
                    onKeyDown={onKeyDown} // Запускаем фильтрацию только по Enter
                />
            </form>
            <div
                className={`cart ${isLoggedIn && servicesCount > 0 ? 'clickable' : 'inactive'}`}
                onClick={isLoggedIn && servicesCount > 0 ? handleCartClick : undefined} // Клик только если авторизован и есть услуги
            >
                <img src="http://127.0.0.1:9000/orbits/cart.png" alt="Корзина" />
                {isLoggedIn && servicesCount > 0 && (
                    <span className="badge">{servicesCount}</span> // Показываем количество услуг
                )}
            </div>
        </div>
    );
};

export default SearchBar;
