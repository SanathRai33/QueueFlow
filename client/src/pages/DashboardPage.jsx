import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchQueues } from '../api/queue.api';
import { fetchAnalytics } from '../api/analytics.api';
import { formatMinutes } from '../utils/format';
import StatCard from '../components/analytics/StatCard';
import QueueLengthChart from '../components/analytics/QueueLengthChart';
import WaitTimeChart from '../components/analytics/WaitTimeChart';
import ServedCancelledChart from '../components/analytics/ServedCancelledChart';
import RecentTokensTable from '../components/analytics/RecentTokensTable';

const ranges = [
  { days: 1, label: 'Last 24 hours' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
];

const percentChange = (current, previous) => {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
};

const DashboardPage = () => {
  const [queues, setQueues] = useState([]);
  const [queueId, setQueueId] = useState('');
  const [days, setDays] = useState(7);
  const [queuesLoading, setQueuesLoading] = useState(true);
  const [queuesError, setQueuesError] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const loadQueues = async () => {
    setQueuesError('');
    setQueuesLoading(true);
    try {
      const list = await fetchQueues();
      setQueues(list);
      if (list.length > 0) setQueueId(list[0].id);
    } catch (err) {
      setQueuesError('Could not load your queues');
    } finally {
      setQueuesLoading(false);
    }
  };

  useEffect(() => {
    loadQueues();
  }, []);

  useEffect(() => {
    if (!queueId) return;

    let ignore = false;
    setLoading(true);
    setError('');

    fetchAnalytics(queueId, days)
      .then((result) => {
        if (!ignore) setAnalytics(result);
      })
      .catch(() => {
        if (!ignore) setError('Could not load the analytics');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [queueId, days, attempt]);

  if (queuesLoading) {
    return <div className="h-64 rounded-xl bg-slate-200 animate-pulse" />;
  }

  if (queuesError) {
    return (
      <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
        <p className="text-slate-600">{queuesError}</p>
        <button
          onClick={loadQueues}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
        >
          Try again
        </button>
      </div>
    );
  }

  if (queues.length === 0) {
    return (
      <div className="rounded-xl bg-white border border-dashed border-slate-300 p-12 text-center">
        <h3 className="text-lg font-semibold">Nothing to show yet</h3>
        <p className="text-slate-500 mt-1">Create a queue and add some people to see numbers here</p>
        <Link
          to="/"
          className="mt-5 inline-block rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium px-4 py-2"
        >
          Go to queues
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={queueId}
            onChange={(e) => setQueueId(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
          >
            {queues.map((queue) => (
              <option key={queue.id} value={queue.id}>
                {queue.name}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-slate-300 bg-white p-0.5">
            {ranges.map((range) => (
              <button
                key={range.days}
                onClick={() => setDays(range.days)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  days === range.days ? 'bg-brand text-white' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-white border border-slate-200 p-8 text-center">
          <p className="text-slate-600">{error}</p>
          <button
            onClick={() => setAttempt(attempt + 1)}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      )}

      {!error && !analytics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 rounded-xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      )}

      {!error && analytics && (
        <div className={`space-y-6 transition-opacity ${loading ? 'opacity-50' : ''}`}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Avg Wait Time"
              value={formatMinutes(analytics.summary.avgWaitMinutes)}
              change={percentChange(
                analytics.summary.avgWaitMinutes,
                analytics.previous.avgWaitMinutes
              )}
              lowerIsBetter
            />
            <StatCard
              label="Tokens Served"
              value={analytics.summary.servedCount}
              change={percentChange(analytics.summary.servedCount, analytics.previous.servedCount)}
            />
            <StatCard
              label="Currently Waiting"
              value={analytics.summary.currentlyWaiting}
              hint="Right now"
            />
            <StatCard
              label="Cancellation Rate"
              value={`${analytics.summary.cancellationRate}%`}
              hint={`${analytics.summary.cancelledCount} cancelled`}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <QueueLengthChart data={analytics.lengthTrend} className="lg:col-span-2" />
            <ServedCancelledChart
              served={analytics.summary.servedCount}
              cancelled={analytics.summary.cancelledCount}
            />
          </div>

          <WaitTimeChart data={analytics.waitByHour} />

          <RecentTokensTable tokens={analytics.recentTokens} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;