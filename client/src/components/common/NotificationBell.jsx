import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaChartLine, FaCommentAlt, FaUserPlus, FaTrophy, FaExclamationCircle } from 'react-icons/fa';
import { getNotifications, markAllNotificationsRead } from '../../services/api';
import { Link } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import './Navbar.css';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { socket } = useSocket();

    const fetchNotifications = async () => {
        try {
            const { data } = await getNotifications();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const getNotificationIcon = (type, content) => {
        if (content.toLowerCase().includes('stock') || content.toLowerCase().includes('price')) return <FaChartLine />;
        if (content.toLowerCase().includes('comment') || content.toLowerCase().includes('reply')) return <FaCommentAlt />;
        if (content.toLowerCase().includes('follow')) return <FaUserPlus />;
        if (content.toLowerCase().includes('badge') || content.toLowerCase().includes('rank')) return <FaTrophy />;
        return <FaExclamationCircle />;
    };

    useEffect(() => {
        fetchNotifications();

        if (socket) {
            socket.on('notification:new', (newNotification) => {
                setNotifications(prev => [newNotification, ...prev]);
                setUnreadCount(prev => prev + 1);
            });
        }

        return () => {
            if (socket) {
                socket.off('notification:new');
            }
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!isOpen && unreadCount > 0) {
            markAllNotificationsRead();
            setUnreadCount(0);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button
                onClick={handleToggle}
                className="notification-bell-btn"
                aria-label="Notifications"
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">Notifications</div>
                    {notifications.length === 0 ? (
                        <div className="notification-empty">No notifications</div>
                    ) : (
                        notifications.map(n => (
                            <Link
                                key={n._id}
                                to={n.link}
                                onClick={() => setIsOpen(false)}
                                className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                            >
                                <div className="notification-icon-wrapper">
                                    {getNotificationIcon(n.type, n.content)}
                                </div>
                                <div className="notification-text-content">
                                    <div className="notification-content">{n.content}</div>
                                    <div className="notification-date">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
