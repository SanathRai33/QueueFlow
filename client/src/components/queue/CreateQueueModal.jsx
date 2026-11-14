import { useEffect, useState } from 'react';
import { createQueue } from '../../api/queue.api';

const CreateQueueModal = ({ onClose, onCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [onClose]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter a queue name');
            return;
        }

        setSubmitting(true);
        try {
            const queue = await createQueue(name);
            onCreated(queue);
        } catch (err) {
            setError(err.response?.data?.message || 'Could not create the queue, try again');
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-30"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-semibold">Create a queue</h2>
                <p className="text-sm text-slate-500 mt-1 mb-5">Give it a name your team will recognise</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-lg bg-red-50 text-red-600 text-sm px-3 py-2">{error}</div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Queue name</label>
                        <input
                            autoFocus
                            type="text"
                            value={name}
                            maxLength={50}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                            placeholder="Billing counter"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-lg bg-brand hover:bg-brand-dark text-white px-4 py-2 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateQueueModal;