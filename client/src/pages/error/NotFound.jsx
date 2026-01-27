import { Link } from 'react-router-dom';
import { FaGhost, FaHome } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <div className="container">
                <div className="not-found-card brute-frame fade-in">
                    <div className="error-code">404</div>
                    <div className="error-visual">
                        <FaGhost className="ghost-icon" />
                    </div>
                    <h1 className="error-title">ZONE EXPIRED</h1>
                    <p className="error-message">
                        This trading floor doesn't exist. The route you're looking for has been liquidated or moved to an unknown exchange.
                    </p>
                    <div className="error-actions">
                        <Link to="/" className="btn btn-primary btn-brute-lg">
                            <FaHome /> BACK TO HOMEBASE
                        </Link>
                    </div>

                    <div className="decorative-fragments">
                        <span className="fragment">$ERROR</span>
                        <span className="fragment">REDACTED</span>
                        <span className="fragment">404_VOID</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
