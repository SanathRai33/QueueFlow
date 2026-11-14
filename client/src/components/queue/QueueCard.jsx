import { Link } from 'react-router-dom';
import { formatTokenNumber } from '../../utils/format';

const QueueCard = ({ queue }) => {
    const { id, name, waitingCount, nowServing } = queue;

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold truncate">{name}</h3>

            <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-slate-500">Waiting</span>
                <span className="rounded-full bg-amber-50 text-amber-700 text-sm font-medium px-3 py-0.5">
                    {waitingCount}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-slate-500">Now serving</span>
                {nowServing ? (
                    <span className="text-sm font-medium text-blue-700 truncate">
                        {formatTokenNumber(nowServing.tokenNumber)} {nowServing.personName}
                    </span>
                ) : (
                    <span className="text-sm text-slate-400">Nobody</span>
                )}
            </div>

            <Link
                to={`/queues/${id}`}
                className="mt-5 block text-center rounded-lg bg-brand hover:bg-brand-dark text-white text-sm font-medium py-2"
            >
                Manage
            </Link>
        </div>
    );
};

export default QueueCard;