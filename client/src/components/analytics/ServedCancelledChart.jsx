import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';

const colors = ['#16a34a', '#dc2626'];

const ServedCancelledChart = ({ served, cancelled, className }) => {
    const data = [
        { name: 'Served', value: served },
        { name: 'Cancelled', value: cancelled },
    ];

    return (
        <ChartCard
            title="Served vs cancelled"
            subtitle="Tokens created in this period"
            isEmpty={served + cancelled === 0}
            className={className}
        >
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                    >
                        {data.map((item, index) => (
                            <Cell key={item.name} fill={colors[index]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </ChartCard>
    );
};

export default ServedCancelledChart;