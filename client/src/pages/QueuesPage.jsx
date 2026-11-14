import { useCallback, useEffect, useState } from 'react';
import { fetchQueues } from '../api/queue.api';
import QueueCard from '../components/queue/QueueCard';
import CreateQueueModal from '../components/queue/CreateQueueModal';

const QueuesPage = () => {
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const loadQueues = async () => {
    setError('');
    setLoading(true);
    try {
      setQueues(await fetchQueues());
    } catch (err) {
      setError('Could not load your queues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueues();
  }, []);

  const closeModal = useCallback(() => setShowModal(false), []);

  const handleCreated = (queue) => {
    setQueues((current) => [{ ...queue, waitingCount: 0, nowServing: null }, ...current]);
    setShowModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">My Queues</h1>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2"
        >
          + Create Queue
        </button>
      </div>

      {loading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
          <p className="text-slate-600">{error}</p>
          <button
            onClick={loadQueues}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && queues.length === 0 && (
        <div className="rounded-xl bg-white border border-dashed border-slate-300 p-12 text-center">
          <h3 className="text-lg font-semibold">No queues yet</h3>
          <p className="text-slate-500 mt-1">Create your first queue to start adding people</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-5 rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2"
          >
            + Create Queue
          </button>
        </div>
      )}

      {!loading && !error && queues.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {queues.map((queue) => (
            <QueueCard key={queue.id} queue={queue} />
          ))}
        </div>
      )}

      {showModal && <CreateQueueModal onClose={closeModal} onCreated={handleCreated} />}
    </div>
  );
};

export default QueuesPage;