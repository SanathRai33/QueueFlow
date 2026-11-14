import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';

const QueueLengthChart = ({ data, className }) => {
    return (
        <ChartCard
            title="Queue length over time"
            subtitle="Highest number of people waiting in each period"
            isEmpty={data.length === 0}
            className={className}
        >
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="peakLength"
                        name="People waiting"
                        stroke="#4f46e5"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default QueueLengthChart;