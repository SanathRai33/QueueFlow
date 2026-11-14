import { ArrowUp, ArrowDown, X } from 'lucide-react';
import { formatTokenNumber, formatElapsed } from '../../utils/format';

const buttonClass =
    'p-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent';

const TokenItem = ({ token, isFirst, isLast, now, disabled, onMove, onCancel }) => {
    return (
        <li className={`flex items-center gap-4 px-4 py-3 ${isFirst ? 'bg-indigo-50' : ''}`}>
            <span className="rounded-lg bg-amber-100 text-amber-800 font-bold text-sm px-2.5 py-1">
                {formatTokenNumber(token.tokenNumber)}
            </span>

            <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{token.personName}</div>
                <div className="text-xs text-slate-500">
                    Waiting: {formatElapsed(token.createdAt, now)}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onMove(token, 'up')}
                    disabled={disabled || isFirst}
                    aria-label="Move up"
                    title="Move up"
                    className={buttonClass}
                >
                    <ArrowUp size={18} />
                </button>
                <button
                    onClick={() => onMove(token, 'down')}
                    disabled={disabled || isLast}
                    aria-label="Move down"
                    title="Move down"
                    className={buttonClass}
                >
                    <ArrowDown size={18} />
                </button>
                <button
                    onClick={() => onCancel(token)}
                    disabled={disabled}
                    aria-label="Cancel token"
                    title="Cancel token"
                    className={`${buttonClass} hover:text-red-600 hover:bg-red-50`}
                >
                    <X size={18} />
                </button>
            </div>
        </li>
    );
};

export default TokenItem;