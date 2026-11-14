import TokenItem from './TokenItem';

const TokenList = ({ tokens, now, disabled, onMove, onCancel }) => {
    if (tokens.length === 0) {
        return (
            <div className="rounded-xl bg-white border border-dashed border-slate-300 p-10 text-center">
                <h3 className="font-semibold">Nobody is waiting</h3>
                <p className="text-sm text-slate-500 mt-1">Add a person above to create a token</p>
            </div>
        );
    }

    return (
        <ul className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
            {tokens.map((token, index) => (
                <TokenItem
                    key={token.id}
                    token={token}
                    isFirst={index === 0}
                    isLast={index === tokens.length - 1}
                    now={now}
                    disabled={disabled}
                    onMove={onMove}
                    onCancel={onCancel}
                />
            ))}
        </ul>
    );
};

export default TokenList;