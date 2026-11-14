import { useEffect } from 'react';

const ConfirmDialog = ({ title, message, confirmText, onConfirm, onCancel }) => {
    useEffect(() => {
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') onCancel();
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onCancel]);

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-30"
            onClick={onCancel}
        >
            <div
                className="bg-white rounded-xl w-full max-w-sm p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-slate-500 mt-2">{message}</p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                        Keep
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-lg bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;