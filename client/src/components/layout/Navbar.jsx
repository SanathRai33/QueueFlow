import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-indigo-50 text-brand' : 'text-slate-600 hover:text-slate-900'
    }`;

const Navbar = () => {
    const { manager, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const closeOnOutsideClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', closeOnOutsideClick);
        return () => document.removeEventListener('mousedown', closeOnOutsideClick);
    }, []);

    const initial = (manager.name || manager.email).charAt(0).toUpperCase();

    return (
        <header className="bg-white border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link to="/" className="text-xl font-bold text-brand">
                        QueueFlow
                    </Link>
                    <nav className="flex items-center gap-1">
                        <NavLink to="/" end className={linkClass}>
                            Queues
                        </NavLink>
                        <NavLink to="/dashboard" className={linkClass}>
                            Dashboard
                        </NavLink>
                    </nav>
                </div>

                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpen(!open)}
                        className="w-9 h-9 rounded-full bg-brand text-white font-semibold"
                    >
                        {initial}
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-lg py-2 z-20">
                            <div className="px-4 pb-2 border-b border-slate-100">
                                <div className="text-sm font-medium truncate">{manager.name || 'Manager'}</div>
                                <div className="text-xs text-slate-500 truncate">{manager.email}</div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;