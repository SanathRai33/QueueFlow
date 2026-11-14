import { formatTokenNumber, formatTimer, formatElapsed } from '../../utils/format';

const NowServingCard = ({
    nowServing,
    recentlyServed,
    waitingCount,
    now,
    disabled,
    onServeNext,
    onComplete,
}) => {
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Now serving</h2>

                {nowServing ? (
                    <div className="mt-4 text-center">
                        <div className="text-5xl font-bold text-blue-600">
                            {formatTokenNumber(nowServing.tokenNumber)}
                        </div>
                        <div className="mt-2 text-lg font-medium truncate">{nowServing.personName}</div>
                        <div className="mt-1 text-sm text-slate-500">
                            Serving for {formatTimer(nowServing.servedAt, now)}
                        </div>
                    </div>
                ) : (
                    <div className="mt-4 py-6 text-center text-slate-400">Nobody is being served</div>
                )}

                <button
                    onClick={onServeNext}
                    disabled={disabled || waitingCount === 0}
                    className="mt-6 w-full rounded-lg bg-brand hover:bg-brand-dark text-white font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Serve Next
                </button>

                {waitingCount === 0 && (
                    <p className="mt-2 text-xs text-center text-slate-400">No one is waiting</p>
                )}

                {nowServing && (
                    <button
                        onClick={onComplete}
                        disabled={disabled}
                        className="mt-3 w-full rounded-lg border border-slate-300 text-sm font-medium py-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Mark as done
                    </button>
                )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    Recently served
                </h2>

                {recentlyServed.length === 0 ? (
                    <p className="mt-3 text-sm text-slate-400">Nothing yet</p>
                ) : (
                    <ul className="mt-3 space-y-3">
                        {recentlyServed.map((token) => (
                            <li key={token.id} className="flex items-center justify-between gap-3 text-sm">
                                <span className="truncate">
                                    <span className="font-medium text-green-700">
                                        {formatTokenNumber(token.tokenNumber)}
                                    </span>{' '}
                                    {token.personName}
                                </span>
                                <span className="text-xs text-slate-500 whitespace-nowrap">
                                    {formatElapsed(token.servedAt, new Date(token.completedAt).getTime())}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NowServingCard;