import { useEffect } from 'react';

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const color = toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600';

    return (
        <div
            className={`fixed bottom-6 right-6 z-40 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${color}`}
        >
            {toast.message}
        </div>
    );
};

export default Toast;