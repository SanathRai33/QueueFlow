const ChartCard = ({ title, subtitle, isEmpty, className = '', children }) => {
    return (
        <div className={`bg-white rounded-xl border border-slate-200 p-5 ${className}`}>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-xs text-slate-500 mb-4">{subtitle}</p>

            {isEmpty ? (
                <div className="h-65 flex items-center justify-center text-sm text-slate-400">
                    No data for this period
                </div>
            ) : (
                children
            )}
        </div>
    );
};

export default ChartCard;