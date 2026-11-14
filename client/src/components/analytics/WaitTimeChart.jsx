import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';

const hourLabel = (hour) => `${String(hour).padStart(2, '0')}:00`;

const WaitTimeChart = ({ data, className }) => {
    return (
        <ChartCard
            title="Average wait by hour"
            subtitle="Based on the hour people joined the queue"
            isEmpty={data.length === 0}
            className={className}
        >
            <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="hour" tickFormatter={hourLabel} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                        labelFormatter={hourLabel}
                        formatter={(value) => [`${value} min`, 'Average wait']}
                    />
                    <Bar dataKey="avgWaitMinutes" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default WaitTimeChart;