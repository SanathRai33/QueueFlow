import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
    fetchQueueDetail,
    addToken,
    moveToken,
    cancelToken,
    serveNext,
    completeCurrent,
} from '../api/token.api';
import useNow from '../hooks/useNow';
import { formatTokenNumber } from '../utils/format';
import AddTokenForm from '../components/token/AddTokenForm';
import TokenList from '../components/token/TokenList';
import NowServingCard from '../components/token/NowServingCard';
import Toast from '../components/ui/Toast';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const QueueDetailPage = () => {
    const { id } = useParams();
    const now = useNow(1000);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [acting, setActing] = useState(false);
    const [toast, setToast] = useState(null);
    const [tokenToCancel, setTokenToCancel] = useState(null);

    const loadQueue = useCallback(async () => {
        try {
            setData(await fetchQueueDetail(id));
            setError('');
        } catch (err) {
            setError(err.response?.status === 404 ? 'Queue not found' : 'Could not load this queue');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadQueue();
    }, [loadQueue]);

    const closeToast = useCallback(() => setToast(null), []);
    const closeConfirm = useCallback(() => setTokenToCancel(null), []);

    const showToast = (type, message) => setToast({ type, message });

    const runAction = async (action) => {
        setActing(true);
        try {
            const message = await action();
            if (message) showToast('success', message);
        } catch (err) {
            showToast('error', err.response?.data?.message || 'Something went wrong, try again');
            await loadQueue();
        } finally {
            setActing(false);
        }
    };

    const handleAdd = async (personName) => {
        const token = await addToken(id, personName);
        setData((current) => ({ ...current, waiting: [...current.waiting, token] }));
        showToast('success', `${formatTokenNumber(token.tokenNumber)} added to the queue`);
    };

    const handleMove = (token, direction) => {
        runAction(async () => {
            const waiting = await moveToken(token.id, direction);
            setData((current) => ({ ...current, waiting }));
        });
    };

    const handleCancelConfirmed = () => {
        const token = tokenToCancel;
        setTokenToCancel(null);

        runAction(async () => {
            const waiting = await cancelToken(token.id);
            setData((current) => ({ ...current, waiting }));
            return `${formatTokenNumber(token.tokenNumber)} was cancelled`;
        });
    };

    const handleServeNext = () => {
        runAction(async () => {
            const token = await serveNext(id);
            await loadQueue();
            return `Now serving ${formatTokenNumber(token.tokenNumber)}`;
        });
    };

    const handleComplete = () => {
        runAction(async () => {
            await completeCurrent(id);
            await loadQueue();
            return 'Marked as done';
        });
    };

    if (loading) {
        return (
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 h-96 rounded-xl bg-slate-200 animate-pulse" />
                <div className="h-96 rounded-xl bg-slate-200 animate-pulse" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
                <p className="text-slate-600">{error}</p>
                <div className="mt-4 flex justify-center gap-3">
                    <Link
                        to="/"
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                        Back to queues
                    </Link>
                    <button
                        onClick={loadQueue}
                        className="rounded-lg bg-brand hover:bg-brand-dark text-white px-4 py-2 text-sm font-medium"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    const { queue, waiting, nowServing, recentlyServed } = data;

    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <Link
                    to="/"
                    aria-label="Back to queues"
                    className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                    <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl font-semibold truncate">{queue.name}</h1>
                <span className="rounded-full bg-amber-50 text-amber-700 text-sm font-medium px-3 py-0.5 whitespace-nowrap">
                    {waiting.length} waiting
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <h2 className="text-lg font-semibold mb-3">Waiting List</h2>
                    <AddTokenForm onAdd={handleAdd} />
                    <TokenList
                        tokens={waiting}
                        now={now}
                        disabled={acting}
                        onMove={handleMove}
                        onCancel={setTokenToCancel}
                    />
                </div>

                <NowServingCard
                    nowServing={nowServing}
                    recentlyServed={recentlyServed}
                    waitingCount={waiting.length}
                    now={now}
                    disabled={acting}
                    onServeNext={handleServeNext}
                    onComplete={handleComplete}
                />
            </div>

            {tokenToCancel && (
                <ConfirmDialog
                    title="Cancel this token?"
                    message={`${formatTokenNumber(tokenToCancel.tokenNumber)} ${tokenToCancel.personName} will be removed from the waiting list.`}
                    confirmText="Cancel token"
                    onConfirm={handleCancelConfirmed}
                    onCancel={closeConfirm}
                />
            )}

            <Toast toast={toast} onClose={closeToast} />
        </div>
    );
};

export default QueueDetailPage;