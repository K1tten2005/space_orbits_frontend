import React from 'react';
import './SearchBar.css';

interface SearchBarProps {
    orbitHeight: string;
    setOrbitHeight: React.Dispatch<React.SetStateAction<string>>;
    onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ orbitHeight, setOrbitHeight, onKeyDown }) => {
    console.log("Current orbitHeight:", orbitHeight);  // Отладочное сообщение
    return (
        <div className="search-cart-container">
            <form>
                <input 
                    type="text" 
                    placeholder="Поиск орбиты по высоте..." 
                    value={orbitHeight} 
                    onChange={(e) => setOrbitHeight(e.target.value)} 
                    onKeyDown={onKeyDown} // Attach onKeyDown here
                />
            </form>
        </div>
    );
};

export default SearchBar;
