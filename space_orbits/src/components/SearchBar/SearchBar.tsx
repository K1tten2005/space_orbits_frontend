import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHeight } from '../../store/slices/orbitsSlice';
import './SearchBar.css';

const SearchBar: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>('');
    const dispatch = useDispatch();

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            dispatch(setHeight(inputValue));
        }
    };

    return (
        <div className="search-cart-container">
            <form>
                <input  
                    type="text"
                    placeholder="Поиск орбиты по высоте..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </form>
        </div>
    );
};

export default SearchBar;
