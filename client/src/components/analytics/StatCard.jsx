import { TrendingUp, TrendingDown } from 'lucide-react';

const Trend = ({ change, lowerIsBetter }) => {
    if (change === null) {
        return <span className="text-xs text-slate-400">No earlier data to compare</span>;
    }

    if (change === 0) {
        return <span className="text-xs text-slate-400">Same as the previous period</span>;
    }

    const increased = change > 0;
    const good = lowerIsBetter ? !increased : increased;
    const Icon = increased ? TrendingUp : TrendingDown;

    return (
        <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${good ? 'text-green-600' : 'text-red-600'
                }`}
        >
            <Icon size={14} />
            {Math.abs(change)}% vs previous period
        </span>
    );
};

const StatCard = ({ label, value, hint, change, lowerIsBetter }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{value}</div>
            <div className="mt-2">
                {change !== undefined ? (
                    <Trend change={change} lowerIsBetter={lowerIsBetter} />
                ) : (
                    <span className="text-xs text-slate-400">{hint}</span>
                )}
            </div>
        </div>
    );
};

export default StatCard;