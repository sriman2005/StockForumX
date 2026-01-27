import { FaMagnifyingGlass, FaXmark } from 'react-icons/fa6';
import './SearchBar.css';

const SearchBar = ({ value = '', onChange, placeholder = 'Search questions...' }) => {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleClear = () => {
        if (onChange) {
            onChange('');
        }
    };

    return (
        <div className="search-bar-container">
            <div className="search-input-wrapper">
                <FaMagnifyingGlass className="search-icon" />
                <input
                    type="text"
                    className="search-input"
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                />
                {value && (
                    <button
                        className="clear-search-btn"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        <FaXmark />
                    </button>
                )}
            </div>
            <div className="search-helper-text">
                <span><b>Indian:</b> Add .NS (e.g., RELIANCE.NS)</span>
                <span className="divider">•</span>
                <span><b>Global:</b> Ticker (e.g., AAPL)</span>
            </div>
        </div >
    );
};

export default SearchBar;
