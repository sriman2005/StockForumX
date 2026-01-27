import { FaGhost } from 'react-icons/fa';
import './EmptyState.css';

const EmptyState = ({
    title = "Nothing Found",
    message = "Try a different search or filter.",
    action,
    onAction
}) => {
    return (
        <div className="empty-state-brute fade-in">
            <div className="empty-state-visual">
                <FaGhost className="empty-icon" />
                <div className="glitch-text" data-text={title}>{title}</div>
            </div>
            <p className="empty-message">{message}</p>
            {action && (
                <button className="btn btn-primary btn-brute-lg" onClick={onAction}>
                    {action}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
