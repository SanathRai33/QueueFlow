import { useState } from 'react';

const AddTokenForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Please enter the name of the person');
            return;
        }

        setSubmitting(true);
        try {
            await onAdd(name);
            setName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not add the person, try again');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-3">
                <input
                    type="text"
                    value={name}
                    maxLength={60}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
                    placeholder="Person name"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Adding...' : 'Add to Queue'}
                </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>
    );
};

export default AddTokenForm;