import { formatTokenNumber, formatDateTime } from '../../utils/format';

const statusStyles = {
    WAITING: 'bg-amber-50 text-amber-700',
    SERVING: 'bg-blue-50 text-blue-700',
    SERVED: 'bg-green-50 text-green-700',
    CANCELLED: 'bg-red-50 text-red-700',
};

const statusLabels = {
    WAITING: 'Waiting',
    SERVING: 'Serving',
    SERVED: 'Served',
    CANCELLED: 'Cancelled',
};

const RecentTokensTable = ({ tokens }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold">Recent tokens</h3>
            <p className="text-xs text-slate-500 mb-4">The last 10 people added to this queue</p>

            {tokens.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">No tokens yet</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-slate-500 border-b border-slate-100">
                                <th className="py-2 pr-4 font-medium">Token</th>
                                <th className="py-2 pr-4 font-medium">Name</th>
                                <th className="py-2 pr-4 font-medium">Joined</th>
                                <th className="py-2 pr-4 font-medium">Wait time</th>
                                <th className="py-2 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tokens.map((token) => (
                                <tr key={token.id}>
                                    <td className="py-3 pr-4 font-medium">{formatTokenNumber(token.tokenNumber)}</td>
                                    <td className="py-3 pr-4">{token.personName}</td>
                                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                                        {formatDateTime(token.createdAt)}
                                    </td>
                                    <td className="py-3 pr-4 whitespace-nowrap">
                                        {token.waitMinutes === null ? '-' : `${token.waitMinutes} min`}
                                    </td>
                                    <td className="py-3">
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[token.status]}`}
                                        >
                                            {statusLabels[token.status]}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RecentTokensTable;